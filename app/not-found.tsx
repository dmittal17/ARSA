import React from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary text-primary flex items-center justify-center mx-auto shadow-cyan-glow">
          <Cpu className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            ERROR 404 • SIGNAL LOST
          </span>
          <h1 className="text-4xl font-heading font-black text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            The telemetry coordinate you entered does not exist or has been shifted in the department grid.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" size="sm" className="gap-2">
              <span>View Events</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
