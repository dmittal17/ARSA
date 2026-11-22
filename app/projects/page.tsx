"use client";

import React, { useState, useEffect } from "react";
import { Layers, Github, ExternalLink } from "lucide-react";
import { ProjectItem } from "@/types";
import { getProjects } from "@/lib/firebase/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>("All");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Projects load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const teams = ["All", ...Array.from(new Set(projects.map((p) => p.team)))];

  const filtered = projects.filter((p) => {
    if (selectedTeam !== "All" && p.team !== selectedTeam) return false;
    return true;
  });

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <Layers className="w-3.5 h-3.5" />
          <span>R&D Labs • ARSA Member Projects</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-ink tracking-tight">
          Robotics Projects
        </h1>
        <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
          Autonomous mobile robots, computer vision algorithms, and robotic manipulator hardware developed by JSPM RSCOE engineers.
        </p>
      </div>

      {/* Team Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-ink-3 uppercase font-medium mr-1">Division:</span>
        {teams.map((tm) => (
          <button
            key={tm}
            onClick={() => setSelectedTeam(tm)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
              selectedTeam === tm
                ? "bg-primary text-white border-transparent shadow-sm font-medium"
                : "bg-surface-alt border-hairline text-ink-2 hover:text-ink"
            }`}
          >
            {tm}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-surface-alt animate-pulse border border-hairline"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col h-full group dd-card"
            >
              <div className="relative aspect-[16/10] w-full bg-surface-alt">
                <SmartImage
                  src={item.imageUrl}
                  alt={item.title}
                  fallbackText={item.title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="primary">{item.team}</Badge>
                </div>
                {item.year && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="neutral">{item.year}</Badge>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-ink group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-2 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-hairline">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-surface-alt text-ink-2 border border-hairline"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1"
                      >
                        <Button variant="secondary" size="sm" className="w-full text-xs gap-1.5">
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </Button>
                      </a>
                    )}
                    {item.demoUrl && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl dd-card">
          <p className="text-ink-2 text-xs">No projects found for this category.</p>
        </div>
      )}
    </div>
  );
}
