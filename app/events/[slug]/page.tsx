"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Award,
  BookOpen,
  HelpCircle,
  Phone,
  Mail,
  CalendarPlus,
  ArrowLeft,
  ExternalLink,
  QrCode as QrIcon,
  Copy,
  Check,
} from "lucide-react";
import { ARSAEvent } from "@/types";
import { getEventBySlug } from "@/lib/firebase/store";
import { CountdownTimer } from "@/components/events/CountdownTimer";
import { RegistrationModal } from "@/components/events/RegistrationModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils";
import { downloadEventIcs, getGoogleCalendarUrl } from "@/lib/utils/calendar";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<ARSAEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const found = await getEventBySlug(slug);
        setEvent(found);

        // Generate QR code for sharing
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href;
          const qr = await QRCode.toDataURL(currentUrl, {
            margin: 2,
            width: 250,
            color: { dark: "#1d1d1f", light: "#FFFFFF" },
          });
          setQrDataUrl(qr);
        }
      } catch (err) {
        console.error("Error loading event detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-surface-alt rounded" />
        <div className="h-80 w-full bg-surface-alt rounded-2xl border border-hairline" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-3/4 bg-surface-alt rounded" />
            <div className="h-4 w-full bg-surface-alt rounded" />
          </div>
          <div className="h-64 bg-surface-alt rounded-2xl border border-hairline" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-3xl font-heading font-bold text-ink">Event Not Found</h2>
        <p className="text-xs text-ink-2">
          The requested coordinate does not match an active or archived event record.
        </p>
        <Link href="/events">
          <Button variant="primary">Browse Events</Button>
        </Link>
      </div>
    );
  }

  const isPast = event.status === "Past";
  const isDeadlinePassed = new Date(event.registrationDeadline).getTime() < Date.now();
  const canRegister = event.isRegistrationOpen && !isPast && !isDeadlinePassed;

  const handleShareWhatsApp = () => {
    const text = `Join me at ${event.title} organized by ARSA JSPM RSCOE! Register here: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("Event link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Navigation & Badges */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to events</span>
        </button>
        <div className="flex items-center gap-2">
          <Badge variant="primary">{event.category}</Badge>
          <Badge variant={event.status === "Upcoming" ? "accent" : "neutral"}>
            {event.status}
          </Badge>
        </div>
      </div>

      {/* Hero Poster Banner */}
      <div className="relative aspect-[21/9] min-h-[260px] w-full rounded-2xl overflow-hidden dd-card shadow-card bg-surface-alt">
        <SmartImage
          src={event.posterUrl}
          alt={`${event.title} - ${event.category} Poster`}
          fallbackText={event.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight tracking-tight">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl font-normal">
            {event.tagline}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-lg font-heading font-bold text-ink flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Event Overview</span>
            </h2>
            <div className="text-xs sm:text-sm text-ink-2 leading-relaxed whitespace-pre-line dd-card p-6 sm:p-8 rounded-2xl">
              {event.description}
            </div>
          </section>

          {/* Schedule Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-ink flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Schedule & Modules</span>
              </h2>
              <div className="space-y-3">
                {event.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl dd-card gap-2"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-soft text-primary font-medium">
                        {item.time}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-ink mt-1">
                        {item.activity}
                      </h4>
                    </div>
                    {item.speaker && (
                      <span className="text-xs text-ink-3 sm:text-right">
                        Lead: <span className="text-ink-2 font-medium">{item.speaker}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prizes */}
          {event.prizes && event.prizes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-ink flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Prize Pool & Honors</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.prizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl dd-card space-y-2"
                  >
                    <span className="text-[11px] text-primary font-semibold uppercase tracking-wider">
                      {prize.position}
                    </span>
                    <h3 className="text-xl font-heading font-bold text-ink tracking-tight">
                      {prize.reward}
                    </h3>
                    {prize.description && (
                      <p className="text-xs text-ink-2 leading-relaxed">
                        {prize.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rules */}
          {event.rules && event.rules.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-ink flex items-center gap-2">
                <span className="text-primary font-mono text-sm">+</span>
                <span>Requirements & Eligibility</span>
              </h2>
              <ul className="space-y-3 dd-card p-6 sm:p-8 rounded-2xl">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-ink-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs */}
          {event.faqs && event.faqs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-ink flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-3">
                {event.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl dd-card space-y-1.5"
                  >
                    <h4 className="text-xs sm:text-sm font-semibold text-ink">
                      {faq.question}
                    </h4>
                    <p className="text-xs text-ink-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organisers Contact */}
          {event.organizers && event.organizers.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-ink">
                Coordinators & Support
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.organizers.map((org, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl dd-card space-y-2"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-ink">{org.name}</h4>
                      <p className="text-[11px] text-primary font-medium">{org.role}</p>
                    </div>
                    <div className="text-xs text-ink-2 space-y-1 pt-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                        <a href={`tel:${org.phone}`} className="hover:text-primary transition-colors font-mono">
                          {org.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <a href={`mailto:${org.email}`} className="hover:text-primary transition-colors truncate">
                          {org.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sticky Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-7 space-y-6 sticky top-24 dd-card shadow-card">
            {/* Fee & Status */}
            <div className="flex items-center justify-between pb-5 border-b border-hairline">
              <div>
                <span className="text-[11px] text-ink-3 uppercase font-medium">Registration Fee</span>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-primary mt-0.5">
                  {formatCurrency(event.fee)}
                </div>
              </div>
              <Badge variant={canRegister ? "primary" : "neutral"} size="md">
                {canRegister ? "Open" : "Closed"}
              </Badge>
            </div>

            {/* Countdown */}
            {canRegister && (
              <div className="p-4 rounded-xl bg-surface-alt border border-hairline">
                <CountdownTimer
                  targetDate={event.registrationDeadline}
                  label="Countdown to Deadline"
                />
              </div>
            )}

            {/* Meta details list */}
            <div className="space-y-3.5 text-xs text-ink-2">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-ink font-medium">Event Dates</div>
                  <div className="text-ink-3 text-[11px]">{formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-ink font-medium">Deadline</div>
                  <div className="text-ink-3 text-[11px]">{formatDateTime(event.registrationDeadline)}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-ink font-medium">Location</div>
                  <div className="text-ink-3 text-[11px]">{event.venue}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-ink font-medium">Participation</div>
                  <div className="text-ink-3 text-[11px]">
                    {event.teamSize.min === event.teamSize.max
                      ? `${event.teamSize.min} Member(s)`
                      : `${event.teamSize.min} to ${event.teamSize.max} Members`}
                  </div>
                </div>
              </div>
            </div>

            {/* Registration CTA button */}
            {event.registrationMode === "external" ? (
              <a
                href={event.externalFormUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button size="lg" className="w-full text-xs gap-2 font-medium">
                  <span>Register on Google Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            ) : (
              <Button
                size="lg"
                className="w-full text-xs gap-2 font-medium"
                disabled={!canRegister}
                onClick={() => setIsRegisterOpen(true)}
              >
                <span>{canRegister ? "Register Now" : "Registrations Closed"}</span>
              </Button>
            )}

            {/* Calendar & Share Toolbar */}
            <div className="pt-4 border-t border-hairline space-y-2">
              <span className="text-[11px] text-ink-3 uppercase font-medium block mb-2">
                Calendar & Share
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => downloadEventIcs(event)}
                >
                  <CalendarPlus className="w-3 h-3 text-primary" />
                  <span>.ICS File</span>
                </Button>
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    <span>Google Cal</span>
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={handleShareWhatsApp}
                  title="Share on WhatsApp"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={handleCopyLink}
                  title="Copy Event Link"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsQrModalOpen(true)}
                  title="Event QR Code"
                >
                  <QrIcon className="w-3.5 h-3.5 text-primary" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky Bottom Registration Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3.5 bg-surface/95 backdrop-blur-md border-t border-hairline flex items-center justify-between gap-3 shadow-card">
        <div>
          <span className="text-[10px] text-ink-3 uppercase">Fee</span>
          <div className="text-lg font-heading font-bold text-primary leading-tight">
            {formatCurrency(event.fee)}
          </div>
        </div>
        {event.registrationMode === "external" ? (
          <a
            href={event.externalFormUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="flex-1 max-w-[200px]"
          >
            <Button size="md" className="w-full text-xs gap-1.5">
              <span>Google Form</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        ) : (
          <Button
            size="md"
            className="flex-1 max-w-[200px] text-xs"
            disabled={!canRegister}
            onClick={() => setIsRegisterOpen(true)}
          >
            {canRegister ? "Register Now" : "Closed"}
          </Button>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Event QR Code Modal */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="Event QR Code"
        description="Scan to open this event directly on mobile."
        maxWidth="sm"
      >
        <div className="p-4 flex flex-col items-center justify-center space-y-4">
          {qrDataUrl && (
            <div className="p-3 bg-white rounded-xl border border-hairline shadow-subtle">
              <Image
                src={qrDataUrl}
                alt="Event QR Code"
                width={200}
                height={200}
                className="rounded"
              />
            </div>
          )}
          <p className="text-xs text-center text-ink-2">
            {event.title}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Page URL</span>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
