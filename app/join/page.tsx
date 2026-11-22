"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, Bot, Layers, Megaphone, Palette, Users } from "lucide-react";
import { AcademicYear, MemberApplication } from "@/types";
import { createMemberApplication } from "@/lib/firebase/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const DOMAINS = [
  {
    name: "Technical Robotics" as const,
    icon: Bot,
    desc: "Autonomous mobile systems, ROS2, embedded FreeRTOS nodes, and sensor telemetry.",
  },
  {
    name: "Software & Web" as const,
    icon: Layers,
    desc: "Full-stack event portals, simulation tools, algorithms, and cloud telemetry.",
  },
  {
    name: "Design & Media" as const,
    icon: Palette,
    desc: "3D CAD modeling, motion graphics, graphic design, and media branding.",
  },
  {
    name: "Event Management" as const,
    icon: Users,
    desc: "Hackathon stage operations, attendee coordination, and logistics execution.",
  },
  {
    name: "Sponsorship & PR" as const,
    icon: Megaphone,
    desc: "Industry outreach, robotics company partnerships, and inter-college relations.",
  },
];

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    year: "FE" as AcademicYear,
    branch: "Automation & Robotics",
    division: "A",
    rollNumber: "",
    preferredDomain: "Technical Robotics" as MemberApplication["preferredDomain"],
    pastExperience: "",
    whyJoin: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.rollNumber || !formData.whyJoin) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const application: MemberApplication = {
        id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        ...formData,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };

      await createMemberApplication(application);

      setSubmitted(true);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#dc2626", "#ef4444", "#111827", "#ffffff", "#9ca3af"],
        });
      } catch {}

      toast.success("Application recorded successfully.");
    } catch (err) {
      console.error("Join submission error:", err);
      toast.error("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recruitment Cycle 2026-2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-ink tracking-tight">
          Join ARSA Committee
        </h1>
        <p className="text-sm text-ink-2 max-w-xl mx-auto leading-relaxed">
          Passionate about autonomous robotics, hardware prototyping, software, or technical events? Submit your application to join ARSA.
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto dd-card">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-ink">
            Application Received
          </h3>
          <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
            Thank you, <strong className="text-ink font-semibold">{formData.fullName}</strong>. Your profile for the{" "}
            <span className="text-primary font-medium">{formData.preferredDomain}</span> domain has been recorded in the ARSA candidate database. The domain heads will reach out for the interaction schedule.
          </p>
          <div className="pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: "",
                  email: "",
                  phone: "",
                  year: "FE",
                  branch: "Automation & Robotics",
                  division: "A",
                  rollNumber: "",
                  preferredDomain: "Technical Robotics",
                  pastExperience: "",
                  whyJoin: "",
                });
              }}
            >
              Submit Another Application
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-10 space-y-8 dd-card">
          {/* Domain Selection Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-2">
              Select Focus Domain <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {DOMAINS.map((domain) => {
                const Icon = domain.icon;
                const isSelected = formData.preferredDomain === domain.name;
                return (
                  <button
                    key={domain.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredDomain: domain.name })}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? "bg-primary-soft border-primary/50 text-ink shadow-subtle"
                        : "bg-surface-alt border-hairline hover:border-hairline-focus text-ink-2"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-ink-3"}`} />
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <div className={`text-xs ${isSelected ? "text-ink font-semibold" : "text-ink-2 font-medium"}`}>
                        {domain.name}
                      </div>
                      <p className="text-[11px] text-ink-3 mt-1 line-clamp-2 leading-relaxed">
                        {domain.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-5 pt-6 border-t border-hairline">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                placeholder="Aarav Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <Input
                label="College Email"
                type="email"
                required
                placeholder="aarav@jspmrscoe.edu.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                required
                placeholder="+91 85955 15962"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="Roll Number / PRN"
                required
                placeholder="e.g. 24AR102"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Academic Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value as AcademicYear })}
                options={[
                  { label: "FE (First Year)", value: "FE" },
                  { label: "SE (Second Year)", value: "SE" },
                  { label: "TE (Third Year)", value: "TE" },
                  { label: "BE (Final Year)", value: "BE" },
                ]}
              />
              <Input
                label="Division"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              />
              <Input
                label="Branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-2">
                Prior Experience / Tools / Portfolios (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. ROS 2, Arduino, Blender, Python, Figma, GitHub link..."
                value={formData.pastExperience}
                onChange={(e) => setFormData({ ...formData, pastExperience: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface text-ink text-sm rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-ink-3 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-2">
                Statement of Motivation <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your interest in automation systems and what contributions you hope to bring to ARSA..."
                value={formData.whyJoin}
                onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface text-ink text-sm rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-ink-3 transition-colors"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full sm:w-auto">
                Submit Application
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
