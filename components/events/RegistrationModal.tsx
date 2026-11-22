"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  CheckCircle2,
  Copy,
  Upload,
  UserPlus,
  Trash2,
  QrCode,
  Printer,
  Sparkles,
} from "lucide-react";
import { ARSAEvent, AcademicYear, Registration, TeamMemberEntry } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatCurrency, generateRegistrationNumber } from "@/lib/utils";
import { generateUpiPayment, PaymentDetails } from "@/lib/services/payment";
import { createRegistration } from "@/lib/firebase/store";
import { sendRegistrationConfirmationEmail } from "@/lib/services/email";

interface RegistrationModalProps {
  event: ARSAEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (registration: Registration) => void;
}

export function RegistrationModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  // Steps: 1: Details, 2: Team (if applicable), 3: Payment (if fee > 0), 4: Confirmed
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [primary, setPrimary] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "JSPM's Rajarshi Shahu College of Engineering, Pune",
    department: "Automation & Robotics",
    year: "SE" as AcademicYear,
    division: "A",
    rollNumber: "",
  });

  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMemberEntry[]>([]);

  // Payment State
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>("");
  const [createdReg, setCreatedReg] = useState<Registration | null>(null);

  const isTeamEvent = event ? event.teamSize.max > 1 : false;
  const isPaidEvent = event ? event.fee > 0 : false;

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCreatedReg(null);
      setUtrNumber("");
      setScreenshotDataUrl("");
    }
  }, [isOpen]);

  // Generate UPI QR code when reaching payment step
  useEffect(() => {
    if (step === 3 && event && isPaidEvent) {
      const tempRegNum = generateRegistrationNumber(event.slug);
      generateUpiPayment({
        amount: event.fee,
        registrationNumber: tempRegNum,
        eventTitle: event.title,
      })
        .then((res) => setPaymentDetails(res))
        .catch((err) => console.error("UPI generation error:", err));
    }
  }, [step, event, isPaidEvent]);

  if (!event) return null;

  const handleAddTeamMember = () => {
    if (teamMembers.length + 1 >= event.teamSize.max) {
      toast.error(`Maximum team size for this event is ${event.teamSize.max}`);
      return;
    }
    setTeamMembers([
      ...teamMembers,
      { fullName: "", email: "", phone: "", rollNumber: "" },
    ]);
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleUpdateTeamMember = (index: number, field: keyof TeamMemberEntry, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primary.fullName || !primary.email || !primary.phone || !primary.rollNumber) {
      toast.error("Please fill all mandatory participant fields.");
      return;
    }
    if (isTeamEvent) {
      setStep(2);
    } else if (isPaidEvent) {
      setStep(3);
    } else {
      finalizeRegistration();
    }
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error("Please enter your Team Name.");
      return;
    }
    const currentTotalSize = 1 + teamMembers.length;
    if (currentTotalSize < event.teamSize.min) {
      toast.error(`Minimum required team size is ${event.teamSize.min} members.`);
      return;
    }
    if (isPaidEvent) {
      setStep(3);
    } else {
      finalizeRegistration();
    }
  };

  const finalizeRegistration = async () => {
    setIsSubmitting(true);
    try {
      const regNumber = generateRegistrationNumber(event.slug);
      const newRegistration: Registration = {
        id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        eventId: event.id,
        eventSlug: event.slug,
        eventTitle: event.title,
        registrationNumber: regNumber,
        createdAt: new Date().toISOString(),
        primaryParticipant: { ...primary },
        teamName: isTeamEvent ? teamName : undefined,
        teamMembers: isTeamEvent && teamMembers.length > 0 ? teamMembers : undefined,
        payment: {
          amount: event.fee,
          required: isPaidEvent,
          status: isPaidEvent ? "Pending" : "Free",
          utrNumber: isPaidEvent ? utrNumber.trim() : undefined,
          screenshotUrl: screenshotDataUrl || undefined,
        },
      };

      await createRegistration(newRegistration);
      await sendRegistrationConfirmationEmail(newRegistration);

      setCreatedReg(newRegistration);
      setStep(4);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#dc2626", "#ef4444", "#111827", "#ffffff", "#9ca3af"],
        });
      } catch {}

      toast.success("Registration submitted successfully!");
      if (onSuccess) onSuccess(newRegistration);
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error("Failed to complete registration. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 4 ? "Registration Pass" : `Register: ${event.title}`}
      description={
        step === 4
          ? "Your pass has been generated. Keep your Registration ID handy."
          : `Fee: ${formatCurrency(event.fee)} • Department of Automation & Robotics`
      }
      maxWidth="2xl"
    >
      {/* Step Indicators */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-hairline">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 1 ? "bg-primary text-white" : "bg-surface-alt text-ink-3 border border-hairline"
              }`}
            >
              1
            </span>
            <span className="text-xs font-medium text-ink">Participant</span>
          </div>
          {isTeamEvent && (
            <>
              <div className="h-px w-8 bg-hairline" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    step >= 2 ? "bg-primary text-white" : "bg-surface-alt text-ink-3 border border-hairline"
                  }`}
                >
                  2
                </span>
                <span className="text-xs font-medium text-ink">Team</span>
              </div>
            </>
          )}
          {isPaidEvent && (
            <>
              <div className="h-px w-8 bg-hairline" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    step >= 3 ? "bg-primary text-white" : "bg-surface-alt text-ink-3 border border-hairline"
                  }`}
                >
                  3
                </span>
                <span className="text-xs font-medium text-ink">Payment</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 1: Primary Participant Details */}
      {step === 1 && (
        <form onSubmit={handleStep1Next} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Aarav Sharma"
              value={primary.fullName}
              onChange={(e) => setPrimary({ ...primary, fullName: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="aarav@jspmrscoe.edu.in"
              value={primary.email}
              onChange={(e) => setPrimary({ ...primary, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              required
              placeholder="+91 85955 15962"
              value={primary.phone}
              onChange={(e) => setPrimary({ ...primary, phone: e.target.value })}
            />
            <Input
              label="Roll Number / PRN"
              required
              placeholder="e.g. 23AR402"
              value={primary.rollNumber}
              onChange={(e) => setPrimary({ ...primary, rollNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Year of Study"
              value={primary.year}
              onChange={(e) => setPrimary({ ...primary, year: e.target.value as AcademicYear })}
              options={[
                { label: "FE (First Year)", value: "FE" },
                { label: "SE (Second Year)", value: "SE" },
                { label: "TE (Third Year)", value: "TE" },
                { label: "BE (Final Year)", value: "BE" },
              ]}
            />
            <Input
              label="Division"
              placeholder="A"
              value={primary.division}
              onChange={(e) => setPrimary({ ...primary, division: e.target.value })}
            />
            <Input
              label="Department"
              placeholder="Automation & Robotics"
              value={primary.department}
              onChange={(e) => setPrimary({ ...primary, department: e.target.value })}
            />
          </div>

          <Input
            label="College / Institute"
            value={primary.college}
            onChange={(e) => setPrimary({ ...primary, college: e.target.value })}
          />

          <div className="pt-6 flex justify-end gap-3 border-t border-hairline">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Continue
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: Team Members (if team event) */}
      {step === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-4">
          <Input
            label="Team Name"
            required
            placeholder="e.g. Autonomous Lab Alpha"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-2">
                Additional Team Members ({teamMembers.length + 1} / {event.teamSize.max})
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTeamMember}
                disabled={teamMembers.length + 1 >= event.teamSize.max}
                className="text-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Member
              </Button>
            </div>

            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-alt border border-hairline space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary uppercase">
                    Member #{idx + 2}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(idx)}
                    className="text-ink-3 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Full Name"
                    value={member.fullName}
                    onChange={(e) => handleUpdateTeamMember(idx, "fullName", e.target.value)}
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={member.email}
                    onChange={(e) => handleUpdateTeamMember(idx, "email", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Phone"
                    value={member.phone}
                    onChange={(e) => handleUpdateTeamMember(idx, "phone", e.target.value)}
                  />
                  <Input
                    placeholder="Roll Number"
                    value={member.rollNumber}
                    onChange={(e) => handleUpdateTeamMember(idx, "rollNumber", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-between gap-3 border-t border-hairline">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" variant="primary">
              Continue to {isPaidEvent ? "Payment" : "Submit"}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: Payment Verification */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-surface-alt border border-hairline flex flex-col sm:flex-row items-center gap-6">
            {paymentDetails?.qrCodeDataUrl ? (
              <div className="p-2.5 bg-white rounded-xl shadow-card shrink-0">
                <Image
                  src={paymentDetails.qrCodeDataUrl}
                  alt="UPI QR Code"
                  width={140}
                  height={140}
                  className="rounded"
                />
              </div>
            ) : (
              <div className="w-[140px] h-[140px] bg-surface-alt animate-pulse rounded-xl flex items-center justify-center text-ink-3">
                <QrCode className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold">
                Amount: {formatCurrency(event.fee)}
              </div>
              <h4 className="font-heading font-semibold text-ink text-base">
                Scan via Any UPI Application
              </h4>
              <p className="text-xs text-ink-2">
                Payee: <strong className="text-ink font-semibold">{paymentDetails?.payeeName || "ARSA JSPM RSCOE"}</strong>
              </p>
              <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                <code className="text-xs font-mono bg-surface px-2.5 py-1 rounded-lg border border-hairline text-primary">
                  {paymentDetails?.upiId || "arsa.rscoe@okaxis"}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs py-1 h-7 font-normal"
                  onClick={() => handleCopy(paymentDetails?.upiId || "arsa.rscoe@okaxis", "UPI ID")}
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* UTR Input & Screenshot */}
          <div className="space-y-4">
            <Input
              label="12-Digit UTR / Transaction Reference Number"
              required
              placeholder="e.g. 432109876543"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              helperText="Locate the 12-digit UPI transaction reference in your payment receipt."
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-2">
                Payment Screenshot
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface border border-hairline hover:border-primary text-ink text-xs cursor-pointer transition-colors shadow-subtle">
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleScreenshotUpload}
                  />
                </label>
                {screenshotDataUrl && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File attached
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between gap-3 border-t border-hairline">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(isTeamEvent ? 2 : 1)}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!utrNumber.trim() || utrNumber.length < 6}
              isLoading={isSubmitting}
              onClick={finalizeRegistration}
            >
              Verify & Complete Registration
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Registration Pass Card */}
      {step === 4 && createdReg && (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl dd-card text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-2xl text-ink tracking-tight">
              Registration Confirmed
            </h4>
            <p className="text-xs text-ink-2 mt-1">
              Your pass for <strong className="text-ink font-semibold">{event.title}</strong> has been secured.
            </p>

            {/* Pass Badge */}
            <div className="mt-6 p-5 rounded-xl bg-surface-alt border border-hairline max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <span className="text-[10px] text-ink-3 uppercase font-semibold">
                  Registration ID
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-soft text-primary font-semibold">
                  {createdReg.payment.status}
                </span>
              </div>
              <div className="font-mono text-lg font-bold text-primary tracking-wider">
                {createdReg.registrationNumber}
              </div>
              <div className="text-xs text-ink-2 space-y-1 pt-1">
                <div>Participant: <span className="text-ink font-medium">{createdReg.primaryParticipant.fullName}</span></div>
                <div>Class: {createdReg.primaryParticipant.year} ({createdReg.primaryParticipant.rollNumber})</div>
                {createdReg.teamName && <div>Team: <span className="text-primary font-medium">{createdReg.teamName}</span></div>}
                <div>Venue: {event.venue}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              className="w-full sm:w-auto text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Pass
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
