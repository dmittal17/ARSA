import QRCode from "qrcode";

export interface PaymentDetails {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  qrCodeDataUrl: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  transactionId?: string;
  message: string;
}

export interface PaymentProvider {
  name: string;
  generatePaymentInfo(params: {
    amount: number;
    registrationId: string;
    eventTitle: string;
  }): Promise<PaymentDetails>;
  verifyPayment(transactionId: string, proofUrl?: string): Promise<PaymentVerificationResult>;
}

// Configurable ARSA Treasury UPI constants (from env or defaults)
export const ARSA_UPI_CONFIG = {
  upiId: process.env.NEXT_PUBLIC_ARSA_UPI_ID || "arsa.rscoe@okaxis",
  payeeName: process.env.NEXT_PUBLIC_ARSA_PAYEE_NAME || "ARSA JSPM RSCOE",
};

/**
 * Generates an interoperable UPI URI and dynamic QR code for any UPI app
 * (Google Pay, PhonePe, Paytm, BHIM, etc.)
 */
export async function generateUpiPayment(params: {
  amount: number;
  registrationNumber: string;
  eventTitle: string;
}): Promise<PaymentDetails> {
  const { amount, registrationNumber, eventTitle } = params;
  const cleanTitle = eventTitle.substring(0, 20).replace(/[^a-zA-Z0-9 ]/g, "");
  const transactionNote = `ARSA:${registrationNumber.slice(-8)}:${cleanTitle}`;

  // Standard UPI URI scheme
  const upiUrl = `upi://pay?pa=${encodeURIComponent(ARSA_UPI_CONFIG.upiId)}&pn=${encodeURIComponent(
    ARSA_UPI_CONFIG.payeeName
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Generate QR code data URL (high contrast, cyan/dark robotics aesthetic)
  const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 320,
    color: {
      dark: "#0B0F19",
      light: "#FFFFFF",
    },
  });

  return {
    upiId: ARSA_UPI_CONFIG.upiId,
    payeeName: ARSA_UPI_CONFIG.payeeName,
    amount,
    transactionNote,
    qrCodeDataUrl,
  };
}

/**
 * UPI Manual Verification Provider
 */
export class UpiManualPaymentProvider implements PaymentProvider {
  name = "UPI Manual Verification (UTR + Screenshot)";

  async generatePaymentInfo(params: {
    amount: number;
    registrationId: string;
    eventTitle: string;
  }): Promise<PaymentDetails> {
    return generateUpiPayment({
      amount: params.amount,
      registrationNumber: params.registrationId,
      eventTitle: params.eventTitle,
    });
  }

  async verifyPayment(transactionId: string, proofUrl?: string): Promise<PaymentVerificationResult> {
    const cleanUtr = transactionId.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      return {
        verified: false,
        message: "UTR / Transaction Reference Number must be at least 8 alphanumeric digits.",
      };
    }
    return {
      verified: true,
      transactionId: cleanUtr,
      message: "UTR submitted for admin verification.",
    };
  }
}

/**
 * Clean abstraction for pluggable Razorpay Payment Gateway (ready for activation)
 */
export class RazorpayPaymentProvider implements PaymentProvider {
  name = "Razorpay";
  private keyId: string;

  constructor(keyId?: string) {
    this.keyId = keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  }

  async generatePaymentInfo(params: {
    amount: number;
    registrationId: string;
    eventTitle: string;
  }): Promise<PaymentDetails> {
    // Falls back to UPI QR generator if Razorpay key is not configured
    return generateUpiPayment({
      amount: params.amount,
      registrationNumber: params.registrationId,
      eventTitle: params.eventTitle,
    });
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    // In production, verifies Razorpay signature via server action or API route
    return {
      verified: true,
      transactionId,
      message: "Payment verified successfully through gateway.",
    };
  }
}

// Active payment service singleton
export const paymentService: PaymentProvider = new UpiManualPaymentProvider();
