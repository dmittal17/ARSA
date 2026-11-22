"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownTimer({ targetDate, label = "Registration Closes In" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-slate-400 text-xs font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        <span>Registration Deadline Passed</span>
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HRS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEC", value: timeLeft.seconds },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-medium">
          {label}
        </p>
      )}
      <div className="flex items-center gap-2">
        {units.map((unit, idx) => (
          <div key={unit.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center bg-[#070A11]/60 border border-white/[0.08] rounded-xl px-3 py-2 min-w-[52px]">
              <span className="font-mono font-light text-lg text-aerospace-white leading-none">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[8px] font-mono tracking-wider text-slate-500 mt-1">{unit.label}</span>
            </div>
            {idx < units.length - 1 && (
              <span className="font-mono text-primary font-light text-xs opacity-60">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
