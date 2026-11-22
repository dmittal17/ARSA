"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Clock, Send, MessageSquare, Instagram, ExternalLink } from "lucide-react";
import { createContactMessage } from "@/lib/firebase/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill your Name, Email, and Message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        id: `msg-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        read: false,
      });

      setSent(true);
      setIsSubmitting(false);
      toast.success("Inquiry received. ARSA coordinators will get back to you shortly.");
    } catch (err) {
      console.error("Message send error:", err);
      toast.error("Failed to send message. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-ink tracking-tight">
          Contact & Location
        </h1>
        <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
          Inquiries regarding workshops, event registrations, sponsorships, or collaborations with ARSA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-heading font-semibold text-ink">
            Send Us a Message
          </h3>

          {sent ? (
            <div className="p-8 text-center rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 space-y-3">
              <p className="text-primary font-medium text-sm">
                Message successfully submitted to ARSA organizers.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSent(false);
                  setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  required
                  placeholder="e.g. Rohan Shinde"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="rohan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 85955 15962"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Subject"
                  placeholder="e.g. Workshop Registration Query"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-ink-2">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can ARSA assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface text-ink text-sm rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-ink-3 transition-colors"
                />
              </div>

              <Button type="submit" size="md" isLoading={isSubmitting} className="w-full sm:w-auto gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </Button>
            </form>
          )}
        </Card>

        {/* Contact Info & Coordinates */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-7 space-y-5">
            <h3 className="text-base font-heading font-semibold text-ink">
              Official Details & Lab Coordinates
            </h3>

            <div className="space-y-4 text-xs text-ink-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-ink font-medium">Department of Automation & Robotics</div>
                  <div className="text-ink-3 text-xs mt-0.5">
                    JSPM&apos;s Rajarshi Shahu College of Engineering<br />
                    Ashok Nagar, Tathawade, Pune, Maharashtra 411033
                  </div>
                  <a
                    href="https://www.jspmrscoe.edu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs mt-1.5"
                  >
                    <span>Visit College Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-ink font-medium">Contact Phone</div>
                  <a
                    href="tel:+918595515962"
                    className="text-primary hover:underline font-mono text-xs"
                  >
                    +91 85955 15962
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-ink font-medium">Department Email</div>
                  <a href="mailto:arsa@jspmrscoe.edu.in" className="text-primary hover:underline text-xs">
                    arsa@jspmrscoe.edu.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-ink font-medium">Hours</div>
                  <div className="text-ink-3 text-xs">Monday - Saturday: 09:00 - 17:30 IST</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center gap-3">
              <a
                href="https://www.instagram.com/arsa.rscoe/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-alt border border-hairline text-ink-2 hover:text-primary transition-colors text-xs font-medium"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram (@arsa.rscoe)</span>
              </a>
            </div>
          </Card>

          {/* Campus Map Embed */}
          <div className="rounded-2xl overflow-hidden border border-hairline h-64 relative bg-surface-alt shadow-subtle">
            <iframe
              title="JSPM RSCOE Tathawade Campus Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.8923055498877!2d73.74780517596045!3d18.623899265997235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9f3659ca223%3A0xad52eeec37b4f535!2sJSPM&#39;s%20Rajarshi%20Shahu%20College%20of%20Engineering%2C%20Tathawade%2C%20Pune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
