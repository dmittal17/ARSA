"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon, UploadCloud, Layers } from "lucide-react";
import { GalleryItem, ARSAEvent } from "@/types";
import { getGalleryItems, saveGalleryItem, deleteGalleryItem, getEvents } from "@/lib/firebase/store";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<ARSAEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Single form
  const [form, setForm] = useState({
    title: "",
    eventTitle: "",
    year: "2027",
    category: "Workshop",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    description: "",
  });

  // Bulk form
  const [bulkEventTitle, setBulkEventTitle] = useState("");
  const [bulkYear, setBulkYear] = useState("2027");
  const [bulkCategory, setBulkCategory] = useState("Workshop");
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  const refresh = async () => {
    const [galleryData, eventsData] = await Promise.all([getGalleryItems(), getEvents()]);
    setItems(galleryData);
    setEvents(eventsData);
    if (eventsData.length > 0 && !form.eventTitle) {
      setForm((prev) => ({ ...prev, eventTitle: eventsData[0].title }));
      setBulkEventTitle(eventsData[0].title);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSingleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          imageUrl: reader.result as string,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        }));
        toast.success("Image file loaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      toast.error("Title and Image URL are required.");
      return;
    }
    try {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ...form,
      };
      await saveGalleryItem(newItem);
      toast.success("Photo added to gallery.");
      setIsModalOpen(false);
      refresh();
    } catch {
      toast.error("Failed to add photo.");
    }
  };

  const handleBulkFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBulkFiles(Array.from(e.target.files));
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkFiles.length === 0) {
      toast.error("Please choose at least one photo file.");
      return;
    }
    if (!bulkEventTitle.trim()) {
      toast.error("Please specify the event name.");
      return;
    }

    setIsBulkUploading(true);
    try {
      for (let i = 0; i < bulkFiles.length; i++) {
        const file = bulkFiles[i];
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const item: GalleryItem = {
          id: `gal-bulk-${Date.now()}-${i}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          eventTitle: bulkEventTitle,
          year: bulkYear,
          category: bulkCategory,
          imageUrl: dataUrl,
          description: `Uploaded from ${bulkEventTitle} (${bulkYear})`,
        };
        await saveGalleryItem(item);
      }

      toast.success(`Successfully uploaded ${bulkFiles.length} images to gallery!`);
      setIsBulkModalOpen(false);
      setBulkFiles([]);
      refresh();
    } catch (err) {
      console.error("Bulk upload error:", err);
      toast.error("Failed to complete bulk upload.");
    } finally {
      setIsBulkUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this photo?")) {
      await deleteGalleryItem(id);
      toast.success("Photo deleted.");
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-heading font-black text-white">
            Gallery Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curate event photos, hardware prototyping footage, and competition albums with bulk upload.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsBulkModalOpen(true)} variant="secondary" size="sm" className="gap-1.5 text-xs">
            <UploadCloud className="w-3.5 h-3.5 text-primary" />
            <span>Bulk Upload</span>
          </Button>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Single Photo</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl dd-card overflow-hidden relative group"
          >
            <div className="relative aspect-[4/3] w-full bg-surface-alt">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-soft text-primary font-medium">
                  {item.year}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded-full text-ink-3 hover:text-red-500 hover:bg-surface-alt transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-heading font-semibold text-ink text-sm truncate">{item.title}</h4>
              <p className="text-xs text-ink-2 truncate">{item.eventTitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Single Photo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Gallery Photo"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Photo Caption / Title"
            required
            placeholder="Line Follower Bot Championship Run"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Event Name
            </label>
            <input
              type="text"
              list="events-list"
              value={form.eventTitle}
              onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
              className="w-full px-3 py-2 bg-cyber-card rounded-lg border border-slate-700 text-foreground"
            />
            <datalist id="events-list">
              {events.map((e) => (
                <option key={e.id} value={e.title} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Academic Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
            <Input
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <div>
            <Input
              label="Image URL"
              required
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <div className="mt-2 flex items-center gap-2">
              <label className="text-[11px] px-2.5 py-1.5 rounded bg-cyber-card border border-slate-700 hover:border-primary text-slate-300 cursor-pointer transition-colors inline-flex items-center gap-1.5 font-mono">
                <span>Upload Local File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSingleImageFile}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-300">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 bg-cyber-card rounded border border-slate-700 text-foreground"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Photo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Image Upload"
        description="Select multiple images from an event to upload in one click"
        maxWidth="lg"
      >
        <form onSubmit={handleBulkUpload} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Tag with Event Title <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              list="bulk-events-list"
              required
              placeholder="e.g. Automate It Hackathon 2027"
              value={bulkEventTitle}
              onChange={(e) => setBulkEventTitle(e.target.value)}
              className="w-full px-3 py-2 bg-cyber-card rounded-lg border border-slate-700 text-foreground"
            />
            <datalist id="bulk-events-list">
              {events.map((e) => (
                <option key={e.id} value={e.title} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Academic Year"
              value={bulkYear}
              onChange={(e) => setBulkYear(e.target.value)}
            />
            <Input
              label="Category"
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
            />
          </div>

          <div className="p-6 border-2 border-dashed border-slate-700 hover:border-primary/50 rounded-xl text-center space-y-2 bg-cyber-dark/50">
            <UploadCloud className="w-8 h-8 text-primary mx-auto" />
            <div className="text-xs font-semibold text-white">Choose multiple image files</div>
            <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 5MB each</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkFilesSelect}
              className="mt-2 text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary file:text-black cursor-pointer"
            />
            {bulkFiles.length > 0 && (
              <p className="text-xs text-emerald-400 font-mono mt-2">
                ✓ {bulkFiles.length} files selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsBulkModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={bulkFiles.length === 0}
              isLoading={isBulkUploading}
              className="gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload {bulkFiles.length} Photos</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
