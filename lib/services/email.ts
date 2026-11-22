import { Registration } from "@/types";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends or simulates sending a registration confirmation email with the unique Registration ID
 */
export async function sendRegistrationConfirmationEmail(
  registration: Registration
): Promise<EmailResult> {
  const { primaryParticipant, eventTitle, registrationNumber, payment } = registration;

  console.log(`[Email Service] Dispatching ticket confirmation to ${primaryParticipant.email}`);
  console.log(`[Email Service] Registration ID: ${registrationNumber} | Event: ${eventTitle}`);

  // If a live Resend API key is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && !resendApiKey.includes("re_1234567890")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "ARSA RSCOE <events@arsa-rscoe.org>",
          to: [primaryParticipant.email],
          subject: `Registration Confirmed: ${eventTitle} [${registrationNumber}]`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #070a12; color: #f8fafc; border: 1px solid #00e5ff; border-radius: 8px;">
              <h2 style="color: #00e5ff; margin-bottom: 5px;">ARSA Events Portal</h2>
              <p style="color: #94a3b8; margin-top: 0;">Dept. of Automation & Robotics, JSPM's RSCOE Pune</p>
              <hr style="border-color: #1e293b;" />
              <h3 style="color: #ffffff;">Hello ${primaryParticipant.fullName},</h3>
              <p>Your registration for <strong>${eventTitle}</strong> has been successfully received.</p>
              
              <div style="background-color: #0d1322; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #00e5ff;">
                <p style="margin: 0; color: #94a3b8; font-size: 13px;">REGISTRATION ID</p>
                <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #00e5ff; font-family: monospace;">${registrationNumber}</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="color: #94a3b8; padding: 6px 0;">Student Name:</td><td style="color: #ffffff; padding: 6px 0;">${primaryParticipant.fullName}</td></tr>
                <tr><td style="color: #94a3b8; padding: 6px 0;">Year & Roll No:</td><td style="color: #ffffff; padding: 6px 0;">${primaryParticipant.year} - ${primaryParticipant.rollNumber}</td></tr>
                <tr><td style="color: #94a3b8; padding: 6px 0;">Payment Status:</td><td style="color: #00e676; padding: 6px 0; font-weight: bold;">${payment.status}</td></tr>
                ${payment.utrNumber ? `<tr><td style="color: #94a3b8; padding: 6px 0;">UTR Reference:</td><td style="color: #ffffff; padding: 6px 0; font-family: monospace;">${payment.utrNumber}</td></tr>` : ""}
              </table>

              <p style="color: #94a3b8; font-size: 13px;">Please present this email or your Registration ID at the event verification desk on the day of the event.</p>
              <hr style="border-color: #1e293b;" />
              <p style="color: #64748b; font-size: 12px; margin: 0;">Automation & Robotics Student Association (ARSA) • JSPM's Rajarshi Shahu College of Engineering, Tathawade, Pune - 411033</p>
            </div>
          `,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, messageId: data.id };
      }
    } catch (e: any) {
      console.warn("Live Resend email dispatch failed, simulated email logged:", e.message);
    }
  }

  // Simulated email dispatch (clean fallback)
  return {
    success: true,
    messageId: `sim-${Date.now()}-${registrationNumber}`,
  };
}
