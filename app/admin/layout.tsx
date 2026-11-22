"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image as ImageIcon,
  Layers,
  Sparkles,
  LogOut,
  ExternalLink,
  Database,
  Menu,
  X,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { getCurrentAdmin, logoutAdmin, AdminUser } from "@/lib/firebase/auth";
import { seedAllData } from "@/lib/firebase/store";
import { Button } from "@/components/ui/Button";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Events Manager", href: "/admin/events", icon: Calendar },
  { name: "Registrations & UTR", href: "/admin/registrations", icon: CreditCard },
  { name: "Member Applications", href: "/admin/members", icon: Users },
  { name: "Gallery Manager", href: "/admin/gallery", icon: ImageIcon },
  { name: "Projects Showcase", href: "/admin/projects", icon: Layers },
  { name: "Core Team", href: "/admin/team", icon: Sparkles },
  { name: "Inquiries", href: "/admin/messages", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    const user = getCurrentAdmin();
    if (!user) {
      router.push("/admin/login");
    } else {
      setAdminUser(user);
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await seedAllData();
      toast.success(`Database seeded with ${res.count} realistic ARSA items!`);
      window.location.reload();
    } catch (err) {
      console.error("Seed error:", err);
      toast.error("Database seeding encountered an issue.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col justify-between bg-surface border-r border-hairline p-6 shrink-0 min-h-screen sticky top-0 shadow-subtle">
        <div className="space-y-6">
          {/* Logo / Admin Badge */}
          <div className="flex items-center gap-3 pb-5 border-b border-hairline">
            <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold">
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div>
              <div className="font-heading font-bold text-ink text-base tracking-tight">
                ARSA
              </div>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-surface-alt text-primary border border-primary/20">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary-soft text-primary font-semibold"
                      : "text-ink-2 hover:text-ink hover:bg-surface-alt"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Seed button, User info, Logout */}
        <div className="pt-6 border-t border-hairline space-y-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSeedDatabase}
            isLoading={isSeeding}
            className="w-full justify-center text-xs gap-1.5"
            title="Refills 6 Dec 2026-May 2027 dummy events, projects, gallery, and team data"
          >
            <Database className="w-3.5 h-3.5 text-primary" />
            <span>Seed 2027 Data</span>
          </Button>

          <div className="p-3 rounded-xl bg-surface-alt border border-hairline text-xs">
            <div className="font-semibold text-ink truncate">{adminUser?.name || "Admin"}</div>
            <div className="text-[11px] text-ink-3 truncate">{adminUser?.email}</div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
                <span>Portal</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="text-xs px-2.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-hairline">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-heading font-bold text-ink text-sm">ARSA Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-ink-2 hover:text-ink hover:bg-surface-alt"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-hairline p-5 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
                  isActive ? "bg-primary-soft text-primary font-semibold" : "text-ink-2 hover:text-ink"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-hairline flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSeedDatabase}
              className="flex-1 text-xs"
            >
              Seed Data
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="text-xs"
            >
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Main Admin View Content */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
