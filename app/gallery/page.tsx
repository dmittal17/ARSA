"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Image as ImageIcon, ZoomIn, Calendar, Tag } from "lucide-react";
import { GalleryItem } from "@/types";
import { getGalleryItems } from "@/lib/firebase/store";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { SmartImage } from "@/components/ui/SmartImage";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await getGalleryItems();
        setItems(data);
      } catch (err) {
        console.error("Gallery load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const years = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.year)))], [items]);
  const eventsList = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.eventTitle)))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedYear !== "All" && item.year !== selectedYear) return false;
      if (selectedEvent !== "All" && item.eventTitle !== selectedEvent) return false;
      return true;
    });
  }, [items, selectedYear, selectedEvent]);

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Department Visual Archive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-ink tracking-tight">
          Robotics Gallery
        </h1>
        <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
          Moments from our flagship hackathons, autonomous bot testing, hardware workshops,
          and ARSA inter-college competition arenas.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-2xl dd-card space-y-3">
        {/* Year Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-ink-3 mr-1 flex items-center gap-1 shrink-0 font-medium uppercase">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Year:
          </span>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`text-xs px-3.5 py-1 rounded-full border transition-all shrink-0 font-medium ${
                selectedYear === yr
                  ? "bg-primary text-white border-transparent shadow-sm"
                  : "bg-surface-alt border-hairline text-ink-2 hover:text-ink"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Event Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-hairline pb-1">
          <span className="text-xs text-ink-3 mr-1 flex items-center gap-1 shrink-0 font-medium uppercase">
            <Tag className="w-3.5 h-3.5 text-primary" /> Event:
          </span>
          {eventsList.map((evt) => (
            <button
              key={evt}
              onClick={() => setSelectedEvent(evt)}
              className={`text-xs px-3.5 py-1 rounded-full border transition-all shrink-0 max-w-[220px] truncate ${
                selectedEvent === evt
                  ? "bg-primary-soft text-primary font-medium border-primary/40"
                  : "bg-surface-alt border-hairline text-ink-2 hover:text-ink"
              }`}
            >
              {evt}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-surface-alt rounded-2xl animate-pulse border border-hairline"
            />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden dd-card cursor-pointer"
            >
              <SmartImage
                src={item.imageUrl}
                alt={`${item.title} - ${item.eventTitle}`}
                fallbackText={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <Badge variant="primary">{item.year}</Badge>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="absolute bottom-3.5 left-3.5 right-3.5">
                <h4 className="text-sm font-heading font-semibold text-white line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {item.eventTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl dd-card">
          <p className="text-ink-2 text-sm">No photos found for the selected filter.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={Boolean(activePhoto)}
        onClose={() => setActivePhoto(null)}
        title={activePhoto?.title}
        description={`${activePhoto?.eventTitle} • Academic Year ${activePhoto?.year}`}
        maxWidth="3xl"
      >
        {activePhoto && (
          <div className="space-y-4">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black">
              <SmartImage
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fallbackText={activePhoto.title}
                fill
                className="object-contain"
              />
            </div>
            {activePhoto.description && (
              <p className="text-xs sm:text-sm text-ink-2 bg-surface-alt p-4 rounded-xl border border-hairline">
                {activePhoto.description}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
