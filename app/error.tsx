"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6 p-8 rounded-2xl glass-panel border border-red-500/30">
        <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-black text-white">
            System Sensor Disruption
          </h2>
          <p className="text-xs text-slate-400">
            An unexpected error occurred while loading this view.
          </p>
        </div>
        <Button onClick={() => reset()} variant="outline" size="sm" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Retry Operation</span>
        </Button>
      </div>
    </div>
  );
}
