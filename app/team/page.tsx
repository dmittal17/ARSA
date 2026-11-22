"use client";

import React, { useState, useEffect } from "react";
import { Users, Linkedin, Instagram, Github } from "lucide-react";
import { TeamMember } from "@/types";
import { getTeamMembers } from "@/lib/firebase/store";
import { Card } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const members = await getTeamMembers();
        setTeam(members);
      } catch (err) {
        console.error("Team load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>Committee • Academic Year 2026-2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-ink tracking-tight">
          Core Leadership
        </h1>
        <p className="text-sm text-ink-2 leading-relaxed">
          The student leads, research fellows, and faculty advisors directing autonomous robotics, hackathons, and department outreach.
        </p>
      </div>

      {/* Team Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-surface-alt animate-pulse border border-hairline"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card
              key={member.id}
              className="group dd-card text-center flex flex-col items-center p-7 space-y-4"
            >
              {/* Photo with clean circular frame */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-hairline group-hover:border-primary/50 transition-colors bg-surface-alt">
                <SmartImage
                  src={member.photoUrl}
                  alt={member.name}
                  fallbackText={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Names & Roles */}
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-base text-ink group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-primary font-medium">{member.role}</p>
                <div className="pt-1.5">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-alt text-ink-2 border border-hairline">
                    {member.domain}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 pt-3 border-t border-hairline w-full justify-center">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-full text-ink-3 hover:text-primary hover:bg-surface-alt transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {member.instagramUrl && (
                  <a
                    href={member.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-full text-ink-3 hover:text-ink hover:bg-surface-alt transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                )}
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-full text-ink-3 hover:text-ink hover:bg-surface-alt transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
