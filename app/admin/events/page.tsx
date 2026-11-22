"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Users,
  Search,
} from "lucide-react";
import { ARSAEvent, EventCategory, EventStatus, RegistrationMode } from "@/types";
import { getEvents, saveEvent, deleteEvent } from "@/lib/firebase/store";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { createSlug, formatCurrency, formatDate } from "@/lib/utils";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ARSAEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ARSAEvent | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ARSAEvent>>({
    title: "",
    slug: "",
    tagline: "",
    category: "Workshop" as EventCategory,
    status: "Upcoming" as EventStatus,
    posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-02-15T09:30:00.000Z",
    endDate: "2027-02-16T17:00:00.000Z",
    registrationDeadline: "2027-02-14T23:59:59.000Z",
    venue: "Robotics Lab (Room 304), JSPM RSCOE",
    fee: 299,
    teamSize: { min: 1, max: 2 },
    registrationMode: "inbuilt" as RegistrationMode,
    externalFormUrl: "",
    isRegistrationOpen: true,
    description: "",
    rules: ["Open to all engineering students.", "Bring your own laptop."],
    featured: true,
  });

  const [rulesText, setRulesText] = useState("");

  const refreshEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Events fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      slug: "",
      tagline: "",
      category: "Workshop",
      status: "Upcoming",
      posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      startDate: "2027-02-15T09:30:00.000Z",
      endDate: "2027-02-16T17:00:00.000Z",
      registrationDeadline: "2027-02-14T23:59:59.000Z",
      venue: "Robotics Lab (Room 304), JSPM RSCOE",
      fee: 0,
      teamSize: { min: 1, max: 2 },
      registrationMode: "inbuilt",
      externalFormUrl: "",
      isRegistrationOpen: true,
      description: "",
      rules: ["Open to all engineering students.", "Bring your own laptop."],
      featured: true,
    });
    setRulesText("Open to all engineering students.\nBring your own laptop with required software installed.");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: ARSAEvent) => {
    setEditingEvent(evt);
    setFormData(evt);
    setRulesText(evt.rules?.join("\n") || "");
    setIsModalOpen(true);
  };

  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Poster image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, posterUrl: reader.result as string }));
        toast.success("Poster file loaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingEvent ? prev.slug : createSlug(val),
    }));
  };

  const handleToggleRegistration = async (evt: ARSAEvent) => {
    try {
      const updated: ARSAEvent = {
        ...evt,
        isRegistrationOpen: !evt.isRegistrationOpen,
      };
      await saveEvent(updated);
      toast.success(
        `Registrations for "${evt.title}" are now ${
          updated.isRegistrationOpen ? "OPEN" : "CLOSED"
        }`
      );
      refreshEvents();
    } catch {
      toast.error("Failed to toggle registration status.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete event "${title}"?`)) {
      try {
        await deleteEvent(id);
        toast.success("Event deleted successfully.");
        refreshEvents();
      } catch {
        toast.error("Failed to delete event.");
      }
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.venue) {
      toast.error("Title, Slug, and Venue are required.");
      return;
    }

    try {
      const fullEvent: ARSAEvent = {
        id: editingEvent ? editingEvent.id : `evt-${formData.slug}-${Date.now().toString(36)}`,
        slug: formData.slug || createSlug(formData.title),
        title: formData.title,
        tagline: formData.tagline || "",
        category: formData.category || "Workshop",
        status: formData.status || "Upcoming",
        posterUrl: formData.posterUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || new Date().toISOString(),
        registrationDeadline: formData.registrationDeadline || new Date().toISOString(),
        venue: formData.venue,
        fee: Number(formData.fee) || 0,
        teamSize: formData.teamSize || { min: 1, max: 2 },
        registrationMode: formData.registrationMode || "inbuilt",
        externalFormUrl: formData.externalFormUrl || "",
        isRegistrationOpen: formData.isRegistrationOpen ?? true,
        description: formData.description || "",
        rules: rulesText.split("\n").map((r) => r.trim()).filter(Boolean),
        schedule: editingEvent?.schedule || [
          { time: "09:30 AM", activity: "Keynote & Problem Briefing" },
          { time: "11:30 AM", activity: "Hands-on Development Sprint" },
          { time: "04:30 PM", activity: "Jury Evaluation & Prize Distribution" },
        ],
        prizes: editingEvent?.prizes || [
          { position: "First Place", reward: "₹5,000 + Tech Hardware Kit" },
        ],
        faqs: editingEvent?.faqs || [
          { question: "Is prior coding experience required?", answer: "Beginner and advanced tracks are provided." },
        ],
        organizers: editingEvent?.organizers || [
          { name: "ARSA Technical Committee", role: "Organiser", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
        ],
        featured: formData.featured ?? true,
        totalRegistrations: editingEvent?.totalRegistrations || 0,
      };

      await saveEvent(fullEvent);
      toast.success(editingEvent ? "Event updated!" : "New event created!");
      setIsModalOpen(false);
      refreshEvents();
    } catch (err) {
      console.error("Save event error:", err);
      toast.error("Failed to save event.");
    }
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            Events Manager
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Create, edit, and toggle registrations for workshops and hackathons.
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>New Event</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
        <input
          type="text"
          placeholder="Filter events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-surface text-ink text-xs rounded-xl border border-hairline focus:outline-none focus:border-primary"
        />
      </div>

      {/* Events Table */}
      <div className="rounded-2xl dd-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-alt text-ink-2 font-medium uppercase text-[11px] border-b border-hairline">
              <tr>
                <th className="p-3.5">Event</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Date & Venue</th>
                <th className="p-3.5">Fee</th>
                <th className="p-3.5">Mode</th>
                <th className="p-3.5">Registration Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filtered.map((evt) => (
                <tr key={evt.id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-hairline bg-surface-alt">
                        <Image
                          src={evt.posterUrl}
                          alt={evt.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-ink max-w-[200px] truncate">
                          {evt.title}
                        </div>
                        <div className="text-[11px] text-ink-3 font-mono">
                          /{evt.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="primary">{evt.category}</Badge>
                  </td>
                  <td className="p-3.5 text-ink-2">
                    <div>{formatDate(evt.startDate)}</div>
                    <div className="text-[11px] text-ink-3 truncate max-w-[150px]">
                      {evt.venue}
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-primary">
                    {formatCurrency(evt.fee)}
                  </td>
                  <td className="p-3.5 text-ink-2">
                    <span className="capitalize">{evt.registrationMode}</span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleRegistration(evt)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
                    >
                      {evt.isRegistrationOpen ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Open</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-ink-3" />
                          <span className="text-ink-3">Closed</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/events/${evt.slug}`} target="_blank">
                        <button
                          className="p-1.5 rounded-lg hover:bg-surface-alt text-ink-3 hover:text-ink"
                          title="View public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1.5 rounded-lg hover:bg-surface-alt text-ink-3 hover:text-primary"
                        title="Edit event"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id, evt.title)}
                        className="p-1.5 rounded-lg hover:bg-surface-alt text-ink-3 hover:text-red-500"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit ARSA Event" : "Create New ARSA Event"}
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Title"
              required
              placeholder="e.g. ROS2 Autonomous Robotics Bootcamp"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <Input
              label="URL Slug (auto-generated)"
              required
              placeholder="ros2-autonomous-bootcamp"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>

          <Input
            label="Tagline / Short Summary"
            placeholder="Master industrial robotics simulation and SLAM navigation..."
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
              options={[
                { label: "Workshop", value: "Workshop" },
                { label: "Competition", value: "Competition" },
                { label: "Hackathon", value: "Hackathon" },
                { label: "Talk", value: "Talk" },
                { label: "Expo", value: "Expo" },
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
              options={[
                { label: "Upcoming", value: "Upcoming" },
                { label: "Ongoing", value: "Ongoing" },
                { label: "Past", value: "Past" },
              ]}
            />
            <Input
              label="Registration Fee (₹ 0 for Free)"
              type="number"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Poster Image URL"
                  placeholder="https://..."
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                />
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-[11px] px-2.5 py-1.5 rounded bg-cyber-card border border-slate-700 hover:border-primary text-slate-300 cursor-pointer transition-colors inline-flex items-center gap-1.5 font-mono">
                    <span>Upload Poster File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePosterFileUpload}
                    />
                  </label>
                  {formData.posterUrl?.startsWith("data:") && (
                    <span className="text-[10px] text-emerald-400 font-mono">File loaded</span>
                  )}
                </div>
              </div>
              <Input
                label="Venue"
                placeholder="Robotics Lab (Room 304), JSPM RSCOE"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>
            {formData.posterUrl && (
              <div className="relative aspect-[21/9] h-24 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 mt-2">
                <Image
                  src={formData.posterUrl}
                  alt="Poster Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Date & Time (ISO)"
              placeholder="2027-02-15T09:30:00.000Z"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date & Time (ISO)"
              placeholder="2027-02-16T17:00:00.000Z"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            <Input
              label="Registration Deadline (ISO)"
              placeholder="2027-02-14T23:59:59.000Z"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Registration Mode"
              value={formData.registrationMode}
              onChange={(e) =>
                setFormData({ ...formData, registrationMode: e.target.value as RegistrationMode })
              }
              options={[
                { label: "Inbuilt (Direct On-Site Portal Registration)", value: "inbuilt" },
                { label: "External (Opens Google Form)", value: "external" },
              ]}
            />
            {formData.registrationMode === "external" && (
              <Input
                label="External Google Form Link"
                placeholder="https://forms.google.com/..."
                value={formData.externalFormUrl}
                onChange={(e) => setFormData({ ...formData, externalFormUrl: e.target.value })}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Description / Overview
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-cyber-card rounded-lg border border-slate-700 text-foreground text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Rules & Guidelines (One per line)
            </label>
            <textarea
              rows={3}
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full p-2.5 bg-cyber-card rounded-lg border border-slate-700 text-foreground text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
