"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, Github, ExternalLink } from "lucide-react";
import { ProjectItem } from "@/types";
import { getProjects, saveProject, deleteProject } from "@/lib/firebase/store";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    team: "ARSA Member Projects",
    description: "",
    tags: "ROS2, Python, LiDAR, Nav2",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    githubUrl: "https://github.com/arsa-rscoe",
    demoUrl: "",
    year: "2026-2027",
  });

  const refresh = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      toast.error("Title and Image URL are required.");
      return;
    }
    try {
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: form.title,
        team: form.team,
        description: form.description,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        imageUrl: form.imageUrl,
        githubUrl: form.githubUrl,
        demoUrl: form.demoUrl,
        featured: true,
        year: form.year,
      };
      await saveProject(newProj);
      toast.success("Project saved.");
      setIsModalOpen(false);
      refresh();
    } catch {
      toast.error("Failed to save project.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this project?")) {
      await deleteProject(id);
      toast.success("Project deleted.");
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-heading font-black text-white">
            Projects Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage student R&D projects and ARSA member robotics projects.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl dd-card overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full bg-surface-alt">
              <Image src={proj.imageUrl} alt={proj.title} fill className="object-cover" />
              <div className="absolute top-2 left-2">
                <Badge variant="primary">{proj.team}</Badge>
              </div>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-semibold text-ink text-sm">{proj.title}</h4>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1 rounded-full text-ink-3 hover:text-red-500 hover:bg-surface-alt"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-ink-2 mt-1 line-clamp-2">{proj.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {proj.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-alt text-ink-2 border border-hairline">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Robotics Project"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Project Title"
            required
            placeholder="Autonomous Delivery AGV"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Team / Lab"
              value={form.team}
              onChange={(e) => setForm({ ...form, team: e.target.value })}
            />
            <Input
              label="Academic Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
          <Input
            label="Image URL"
            required
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <Input
            label="Tech Tags (comma separated)"
            placeholder="ROS2, Python, LiDAR"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <Input
            label="GitHub URL"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          />
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-300">Description</label>
            <textarea
              rows={3}
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
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
