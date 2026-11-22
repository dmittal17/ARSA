"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Linkedin, Instagram, Github } from "lucide-react";
import { TeamMember } from "@/types";
import { getTeamMembers, saveTeamMember, deleteTeamMember } from "@/lib/firebase/store";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    domain: "Technical Robotics",
    year: "TE",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    linkedinUrl: "https://linkedin.com",
    instagramUrl: "https://instagram.com",
    githubUrl: "https://github.com",
    order: 10,
  });

  const refresh = async () => {
    const data = await getTeamMembers();
    setTeam(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast.error("Name and Role are required.");
      return;
    }
    try {
      const newMember: TeamMember = {
        id: form.id || `tm-${Date.now()}`,
        name: form.name!,
        role: form.role!,
        domain: form.domain || "Core",
        year: form.year || "TE",
        photoUrl: form.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        linkedinUrl: form.linkedinUrl,
        instagramUrl: form.instagramUrl,
        githubUrl: form.githubUrl,
        order: Number(form.order) || 99,
      };
      await saveTeamMember(newMember);
      toast.success("Team member saved.");
      setIsModalOpen(false);
      refresh();
    } catch {
      toast.error("Failed to save team member.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove this team member?")) {
      await deleteTeamMember(id);
      toast.success("Team member removed.");
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-heading font-black text-white">
            Core Team Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage President, VP, Domain Heads, and Faculty Advisors.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {team.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl dd-card text-center space-y-3 relative group"
          >
            <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-hairline group-hover:border-primary/50 transition-colors bg-surface-alt">
              <Image src={m.photoUrl} alt={m.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-ink text-sm">{m.name}</h4>
              <p className="text-xs text-primary font-medium">{m.role}</p>
              <p className="text-[11px] text-ink-3 mt-0.5">{m.domain} • {m.year}</p>
            </div>
            <button
              onClick={() => handleDelete(m.id)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-ink-3 hover:text-red-500 hover:bg-surface-alt transition-colors"
              title="Delete member"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Team Member"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            required
            placeholder="Atharva Joshi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Role"
              required
              placeholder="Technical Lead"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <Input
              label="Domain"
              placeholder="Robotics"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Academic Year"
              placeholder="TE / BE"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
            <Input
              label="Display Order (number)"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
          <Input
            label="Photo URL"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="LinkedIn URL"
              value={form.linkedinUrl}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            />
            <Input
              label="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
