"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Award,
  Users,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import { ARSAEvent, ProjectItem } from "@/types";
import { getEvents, getProjects } from "@/lib/firebase/store";
import { EventCard } from "@/components/events/EventCard";
import { RegistrationModal } from "@/components/events/RegistrationModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  const [events, setEvents] = useState<ARSAEvent[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ARSAEvent | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 380;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [allEvents, allProjects] = await Promise.all([
          getEvents(),
          getProjects(),
        ]);
        setEvents(allEvents);
        setProjects(allProjects.filter((p) => p.featured).slice(0, 3));
      } catch (err) {
        console.error("Home page data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingEvents = events.filter(
    (e) => e.status === "Upcoming" || e.status === "Ongoing"
  );

  const stats = [
    { value: "1,200+", label: "Active Student Members", icon: Users },
    { value: "45+", label: "Events & Hackathons", icon: Calendar },
    { value: "8,500+", label: "Total Participants", icon: Bot },
    { value: "₹2.5L+", label: "Annual Prize Pool", icon: Award },
  ];

  const handleQuickRegister = (event: ARSAEvent) => {
    setSelectedEvent(event);
    setIsRegisterOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-canvas overflow-x-hidden">
      {/* HERO SECTION: Techfest Cybernetic Kinetic Aesthetic */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-28 bg-cyber-grid">
        {/* Ambient atmospheric glowing flares */}
        <div className="glow-flare-red -top-36 left-1/2 -translate-x-1/2 w-[650px] h-[350px] sm:w-[900px] sm:h-[450px]" />
        <div className="glow-flare-red top-80 -left-48 w-[380px] h-[380px] opacity-50" />
        <div className="glow-flare-red top-96 -right-48 w-[380px] h-[380px] opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Cyber Telemetry Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-primary/30 text-xs font-mono text-ink shadow-[0_0_25px_rgba(255,42,64,0.15)] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary font-bold tracking-wider uppercase text-[11px]">SYS ONLINE</span>
            <span className="text-ink-3">•</span>
            <span className="text-ink-2 text-[11px] font-sans">Dept. of Automation & Robotics • JSPM RSCOE</span>
          </motion.div>

          {/* Main Title: Space Grotesk Shimmer */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-ink max-w-5xl mx-auto leading-[1.05]"
          >
            Automate. Innovate.{" "}
            <span className="animate-shimmer-text">
              Build.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-ink-2 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            The official portal for autonomous robotics, state-level hackathons, ROS 2 bootcamps, and student engineering at JSPM&apos;s RSCOE Pune.
          </motion.p>

          {/* High Energy CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/events" className="w-full sm:w-auto">
              <Button size="lg" className="btn-glow bg-primary hover:bg-primary-hover text-white gap-2 text-sm w-full sm:w-auto font-semibold shadow-card">
                <span>Explore Competitions</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/join" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="backdrop-blur-md border border-hairline/80 hover:border-primary/50 text-ink gap-2 text-sm w-full sm:w-auto">
                <span>Join ARSA Committee</span>
              </Button>
            </Link>
          </motion.div>

          {/* Live Stats: Cyber HUD Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl hud-card text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs text-ink-2 mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* INFINITE MARQUEE TICKER (Techfest Style) */}
      <div className="py-3.5 border-y border-hairline/80 bg-surface/50 backdrop-blur-md overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap text-xs font-mono tracking-widest uppercase text-ink-2 flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-ink font-semibold"><Zap className="w-3.5 h-3.5 text-primary" /> ARSA 2026-27</span>
          <span className="text-primary font-bold">●</span>
          <span>🏎️ LINE FOLLOWER & ROBORACE ARENA</span>
          <span className="text-primary font-bold">●</span>
          <span>🤖 36HR HARDWARE HACKATHON</span>
          <span className="text-primary font-bold">●</span>
          <span>🛰️ ROS 2 HUMBLE & GAZEBO SIMULATION</span>
          <span className="text-primary font-bold">●</span>
          <span className="text-primary font-bold">🏆 ₹2,50,000+ PRIZE POOL</span>
          <span className="text-primary font-bold">●</span>
          <span>🔥 JSPM RSCOE TATHAWADE PUNE</span>
          <span className="text-primary font-bold">●</span>
          <span className="flex items-center gap-1.5 text-ink font-semibold"><Sparkles className="w-3.5 h-3.5 text-primary" /> ARSA 2026-27</span>
          <span className="text-primary font-bold">●</span>
          <span>🏎️ LINE FOLLOWER & ROBORACE ARENA</span>
          <span className="text-primary font-bold">●</span>
          <span>🤖 36HR HARDWARE HACKATHON</span>
          <span className="text-primary font-bold">●</span>
          <span>🛰️ ROS 2 HUMBLE & GAZEBO SIMULATION</span>
          <span className="text-primary font-bold">●</span>
          <span className="text-primary font-bold">🏆 ₹2,50,000+ PRIZE POOL</span>
          <span className="text-primary font-bold">●</span>
          <span>🔥 JSPM RSCOE TATHAWADE PUNE</span>
          <span className="text-primary font-bold">●</span>
        </div>
      </div>

      {/* UPCOMING EVENTS SECTION */}
      <section className="py-24 relative bg-surface-alt/30 border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Active Registrations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink tracking-tight">
                Upcoming ARSA Events
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollSlider("left")}
                  className="p-2.5 rounded-full bg-surface border border-hairline text-ink-2 hover:text-ink hover:border-primary/40 shadow-subtle transition-colors"
                  aria-label="Previous events"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSlider("right")}
                  className="p-2.5 rounded-full bg-surface border border-hairline text-ink-2 hover:text-ink hover:border-primary/40 shadow-subtle transition-colors"
                  aria-label="Next events"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Link href="/events">
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-surface animate-pulse border border-hairline" />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="min-w-[320px] sm:min-w-[380px] max-w-[400px] snap-start shrink-0 flex flex-col"
                >
                  <EventCard
                    event={evt}
                    onQuickRegister={handleQuickRegister}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl hud-card">
              <p className="text-ink-2 text-xs">No upcoming events scheduled at this moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PROJECTS: ARSA Member Projects */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Student Innovations & Research</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink tracking-tight">
              ARSA Member Projects
            </h2>
          </div>
          <Link href="/projects">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <span>View All Projects</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl hud-card overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] w-full bg-surface-alt overflow-hidden">
                <Image
                  src={proj.imageUrl}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="primary">{proj.team}</Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-ink group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-ink-2 mt-2 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-hairline mb-3">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-surface-alt text-ink-2 border border-hairline"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT ARSA SECTION */}
      <section className="py-24 border-t border-hairline bg-surface-alt/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dept. of Automation & Robotics</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-ink leading-tight tracking-tight">
                Empowering Students in Autonomous Robotics & Automation
              </h2>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                Founded under the Department of Automation & Robotics at JSPM&apos;s Rajarshi Shahu College of Engineering,
                ARSA bridges the engineering curriculum with real-world technical practices. Students build hands-on mastery
                in Robot Operating System (ROS 2), FreeRTOS embedded systems, computer vision, and competitive robotics.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl hud-card">
                  <h4 className="font-heading font-semibold text-ink text-sm">Room 304 Lab</h4>
                  <p className="text-xs text-ink-2 mt-1.5 leading-relaxed">
                    Direct access to rapid prototyping boards, 3D printers, and robot testbeds.
                  </p>
                </div>
                <div className="p-5 rounded-xl hud-card">
                  <h4 className="font-heading font-semibold text-ink text-sm">Industry Mentorship</h4>
                  <p className="text-xs text-ink-2 mt-1.5 leading-relaxed">
                    Workshops and hackathons led by robotics automation experts and researchers.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link href="/join">
                  <Button variant="primary" size="md" className="btn-glow gap-2 text-xs font-semibold">
                    <span>Apply for ARSA Membership</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden hud-card shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                alt="ARSA Robotics Lab"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-surface/90 backdrop-blur-md border border-hairline text-xs">
                <div className="text-ink font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Robotics & Automation Research Center
                </div>
                <div className="text-ink-2 text-[11px] mt-1">Room 304, JSPM RSCOE Tathawade Campus, Pune</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK REGISTRATION MODAL */}
      <RegistrationModal
        event={selectedEvent}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
