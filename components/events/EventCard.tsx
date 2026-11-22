import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, ExternalLink } from "lucide-react";
import { ARSAEvent } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatDate, formatCurrency } from "@/lib/utils";

interface EventCardProps {
  event: ARSAEvent;
  onQuickRegister?: (event: ARSAEvent) => void;
}

export function EventCard({ event, onQuickRegister }: EventCardProps) {
  const isPast = event.status === "Past";
  const isRegistrationClosed = !event.isRegistrationOpen || isPast;

  return (
    <Card className="flex flex-col h-full group dd-card">
      {/* Poster Image & Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-alt">
        <SmartImage
          src={event.posterUrl}
          alt={`${event.title} - ${event.category} Poster`}
          fallbackText={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <Badge variant="primary">
            {event.category}
          </Badge>
          <Badge variant={event.status === "Upcoming" ? "accent" : "neutral"}>
            {event.status}
          </Badge>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-hairline text-xs font-semibold text-primary shadow-subtle">
          {formatCurrency(event.fee)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/events/${event.slug}`}>
            <h3 className="text-base sm:text-lg font-heading font-semibold text-ink group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
          </Link>
          <p className="text-xs text-ink-2 mt-2 line-clamp-2 leading-relaxed">
            {event.tagline}
          </p>
        </div>

        {/* Event Meta Details */}
        <div className="space-y-2 pt-3 border-t border-hairline text-xs text-ink-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-ink-3 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-ink-3 shrink-0" />
            <span>
              {event.teamSize.min === event.teamSize.max
                ? event.teamSize.min === 1
                  ? "Solo"
                  : `Team of ${event.teamSize.min}`
                : `Team of ${event.teamSize.min} - ${event.teamSize.max}`}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-2">
          <Link href={`/events/${event.slug}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full text-xs gap-1.5">
              <span>Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          {!isPast && (
            event.registrationMode === "external" ? (
              <a
                href={event.externalFormUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button variant="primary" size="sm" className="w-full text-xs gap-1.5">
                  <span>Register</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs"
                disabled={isRegistrationClosed}
                onClick={() => onQuickRegister && onQuickRegister(event)}
              >
                {isRegistrationClosed ? "Closed" : "Register"}
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  );
}
