"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { loginAdmin, getCurrentAdmin } from "@/lib/firebase/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const current = getCurrentAdmin();
    if (current) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginAdmin(email, password);
      toast.success("Welcome back, Organiser!");
      router.push("/admin");
    } catch (err: any) {
      console.error("Login failure:", err);
      toast.error(err.message || "Failed to log in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin123");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 sm:p-10 dd-card shadow-card">
        {/* Top header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary mx-auto flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink tracking-tight">
              Organiser Login
            </h2>
            <p className="text-xs text-ink-3 mt-1">
              ARSA • JSPM RSCOE PUNE
            </p>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Authorised Email"
            type="email"
            required
            placeholder="admin@arsa.org or ...@jspmrscoe.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full gap-2 mt-2">
            <span>Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="mt-8 pt-6 border-t border-hairline space-y-2.5">
          <span className="text-xs font-semibold text-ink-3 uppercase block text-center">
            Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFillDemo("admin@arsa.org")}
              className="px-2.5 py-1.5 rounded-lg bg-surface-alt border border-hairline hover:border-primary text-ink-2 hover:text-ink transition-colors text-xs font-medium"
            >
              SuperAdmin Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("hod.robotics@jspmrscoe.edu.in")}
              className="px-2.5 py-1.5 rounded-lg bg-surface-alt border border-hairline hover:border-primary text-ink-2 hover:text-ink transition-colors text-xs font-medium"
            >
              Faculty Demo
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-ink-3 hover:text-primary transition-colors">
            ← Return to Public Portal
          </Link>
        </div>
      </Card>
    </div>
  );
}
