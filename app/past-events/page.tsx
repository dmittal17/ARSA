"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { History, Award, Users, Trophy } from "lucide-react";
import { ARSAEvent } from "@/types";
import { getEvents } from "@/lib/firebase/store";
import { SEED_PAST_EVENTS } from "@/data/seed/seed-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatDate } from "@/lib/utils";

export default function PastEventsPage() {
  const [pastEvents, setPastEvents] = useState<ARSAEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPast() {
      try {
        const events = await getEvents();
        setPastEvents(events.filter((e) => e.status === "Past"));
      } catch (err) {
        console.error("Past events load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPast();
  }, []);

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <History className="w-3.5 h-3.5" />
          <span>Archival Recaps & Recognition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-ink tracking-tight">
          Past Events & Highlights
        </h1>
        <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
          Celebrating autonomous innovation, competition sprints, and podium finishers from previous ARSA technical festivals.
        </p>
      </div>

      {/* Detailed Past Events Recaps with Winners */}
      <div className="space-y-8">
        {SEED_PAST_EVENTS.map((item) => (
          <Card
            key={item.id}
            className="p-6 sm:p-8 dd-card space-y-6"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
              {/* Highlight Image */}
              <div className="relative aspect-[16/10] w-full lg:w-96 rounded-xl overflow-hidden shrink-0 bg-surface-alt border border-hairline">
                <SmartImage
                  src={item.posterUrl}
                  alt={`${item.title} Highlights`}
                  fallbackText={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="neutral">{item.date}</Badge>
                </div>
              </div>

              {/* Details & Metrics */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-ink tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-2 mt-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-ink-2 bg-surface-alt p-3.5 rounded-xl border border-hairline">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium text-ink">{item.participants} Participants</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-ink-3" />
                    <span>{item.teams} Teams</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold text-ink">{item.prizesDistributed} Pool</span>
                  </div>
                </div>

                {/* Podium Winners */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-primary" /> Podium Honors
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-surface-alt border border-hairline text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">{item.winnerTeam}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-800">
                          1st Place
                        </span>
                      </div>
                      <p className="text-ink-3 text-[11px]">
                        Champion Team
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-alt border border-hairline text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">{item.runnerUpTeam}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-ink-2 border border-hairline font-medium">
                          2nd Place
                        </span>
                      </div>
                      <p className="text-ink-3 text-[11px]">
                        Runner Up Team
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Catalog of other past events */}
      {pastEvents.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-hairline">
          <h3 className="text-lg font-heading font-bold text-ink">
            Archival Catalog
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((evt) => (
              <Card key={evt.id} className="p-6 space-y-3 dd-card">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{evt.category}</Badge>
                  <span className="text-xs text-ink-3">
                    {formatDate(evt.startDate)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-ink line-clamp-1">
                  {evt.title}
                </h4>
                <p className="text-xs text-ink-2 line-clamp-2">
                  {evt.tagline}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-ink-3 border-t border-hairline">
                  <span className="truncate max-w-[180px]">{evt.venue}</span>
                  <Link href={`/events/${evt.slug}`} className="text-primary hover:underline font-medium">
                    View Recap
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
