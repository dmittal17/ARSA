"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Calendar,
  Sparkles,
  Users,
  Layers,
  PhoneCall,
  Image as ImageIcon,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Past Events", href: "/past-events", icon: History },
  { name: "Projects", href: "/projects", icon: Layers },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Team", href: "/team", icon: Users },
  { name: "Join ARSA", href: "/join", icon: Sparkles },
  { name: "Contact", href: "/contact", icon: PhoneCall },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-surface/90 backdrop-blur-md border-b border-hairline py-2.5 shadow-subtle"
          : "bg-surface/60 backdrop-blur-sm border-b border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* DDRobocon Style Clean Brand Mark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center transition-colors">
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-semibold text-base tracking-tight text-ink group-hover:text-primary transition-colors">
                  ARSA
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-surface-alt text-ink-2 border border-hairline">
                  RSCOE
                </span>
              </div>
              <p className="text-[10px] text-ink-3 hidden sm:block">
                Dept. of Automation & Robotics
              </p>
            </div>
          </Link>

          {/* Clean Minimal Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-alt/70 border border-hairline rounded-full px-3 py-1">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full transition-all duration-200",
                    isActive
                      ? "text-primary bg-surface font-semibold shadow-subtle"
                      : "text-ink-2 hover:text-ink hover:bg-surface/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-ink-2 hover:text-ink hover:bg-surface-alt transition-colors border border-hairline"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-ink-2" />
                )}
              </button>
            )}

            {/* Admin Portal Link */}
            <Link href="/admin">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-ink-2" />
                <span>Admin</span>
              </Button>
            </Link>

            {/* Join CTA */}
            <Link href="/join">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <span>Join ARSA</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-ink-2 hover:text-ink hover:bg-surface-alt border border-hairline"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-ink-2" />
                )}
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-ink hover:bg-surface-alt border border-hairline focus:outline-none"
              aria-label="Open menu"
            >
              {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-surface/98 backdrop-blur-xl border-b border-hairline shadow-card p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-colors",
                    isActive
                      ? "bg-primary-soft text-primary font-semibold"
                      : "text-ink-2 hover:text-ink hover:bg-surface-alt"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-hairline flex flex-col gap-2">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full justify-center text-xs gap-2">
                  <ShieldCheck className="w-4 h-4 text-ink-2" />
                  Organiser Admin Portal
                </Button>
              </Link>
              <Link href="/join" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full justify-center text-xs gap-2">
                  Apply for ARSA Membership
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
