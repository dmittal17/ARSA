"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { ARSAEvent, EventCategory, EventStatus } from "@/types";
import { getEvents } from "@/lib/firebase/store";
import { EventCard } from "@/components/events/EventCard";
import { RegistrationModal } from "@/components/events/RegistrationModal";
import { Button } from "@/components/ui/Button";

const CATEGORIES: Array<"All" | EventCategory> = [
  "All",
  "Workshop",
  "Competition",
  "Hackathon",
  "Talk",
  "Expo",
];

const STATUSES: Array<"All" | EventStatus> = [
  "All",
  "Upcoming",
  "Ongoing",
  "Past",
];

export default function EventsPage() {
  const [events, setEvents] = useState<ARSAEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | EventCategory>("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | EventStatus>("All");
  const [selectedEvent, setSelectedEvent] = useState<ARSAEvent | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Category filter
      if (selectedCategory !== "All" && evt.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "All" && evt.status !== selectedStatus) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesTagline = evt.tagline.toLowerCase().includes(query);
        const matchesVenue = evt.venue.toLowerCase().includes(query);
        return matchesTitle || matchesTagline || matchesVenue;
      }
      return true;
    });
  }, [events, selectedCategory, selectedStatus, searchQuery]);

  const handleQuickRegister = (event: ARSAEvent) => {
    setSelectedEvent(event);
    setIsRegisterOpen(true);
  };

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
      {/* Ambient background flare */}
      <div className="glow-flare-red -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-40" />

      {/* Header */}
      <div className="space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Academic Cycle 2026-2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-ink tracking-tight">
          Events & <span className="animate-shimmer-text">Competitions</span>
        </h1>
        <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
          Explore upcoming autonomous robotics bootcamps, hardware prototyping tracks, and technical competitions hosted by ARSA JSPM RSCOE.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 sm:p-6 rounded-2xl hud-card space-y-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
            <input
              type="text"
              placeholder="Search by event title, tech stack, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-alt text-ink text-sm rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-ink-3 transition-colors"
            />
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`text-xs px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-alt text-ink-2 hover:text-ink border border-hairline"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-hairline pb-1">
          <span className="text-xs text-ink-3 flex items-center gap-1 font-medium shrink-0 mr-1 uppercase">
            <Filter className="w-3 h-3 text-primary" /> Filter:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-primary-soft border-primary/40 text-primary font-medium"
                  : "bg-surface-alt border-hairline text-ink-2 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-surface-alt animate-pulse border border-hairline"
            />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onQuickRegister={handleQuickRegister}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl dd-card space-y-3">
          <p className="text-ink font-heading font-semibold text-base">No events found matching your search parameters.</p>
          <p className="text-xs text-ink-3">Try resetting filters to explore all scheduled activities.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedStatus("All");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Quick Registration Modal */}
      <RegistrationModal
        event={selectedEvent}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
