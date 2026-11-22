"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { ARSAEvent, Registration, MemberApplication } from "@/types";
import {
  getEvents,
  getRegistrations,
  getMemberApplications,
} from "@/lib/firebase/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<ARSAEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [members, setMembers] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [evts, regs, mems] = await Promise.all([
          getEvents(),
          getRegistrations(),
          getMemberApplications(),
        ]);
        setEvents(evts);
        setRegistrations(regs);
        setMembers(mems);
      } catch (err) {
        console.error("Dashboard metrics load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const pendingPayments = registrations.filter((r) => r.payment.status === "Pending");
  const verifiedPayments = registrations.filter((r) => r.payment.status === "Verified");
  const totalRevenue = verifiedPayments.reduce((acc, r) => acc + (r.payment.amount || 0), 0);

  const kpis = [
    {
      label: "Total Events",
      value: events.length,
      subtext: `${events.filter((e) => e.status === "Upcoming").length} active upcoming`,
      icon: Calendar,
      href: "/admin/events",
    },
    {
      label: "Registrations",
      value: registrations.length,
      subtext: `${verifiedPayments.length} verified passes`,
      icon: Users,
      href: "/admin/registrations",
    },
    {
      label: "Pending Verification",
      value: pendingPayments.length,
      subtext: "Awaiting UTR review",
      icon: AlertCircle,
      href: "/admin/registrations",
    },
    {
      label: "Treasury Revenue",
      value: formatCurrency(totalRevenue),
      subtext: "Collected via UPI",
      icon: TrendingUp,
      href: "/admin/registrations",
    },
    {
      label: "Membership Candidates",
      value: members.length,
      subtext: "Submitted applications",
      icon: Users,
      href: "/admin/members",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            ARSA • Dept. of Automation & Robotics • JSPM RSCOE Pune
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/events">
            <Button size="sm" className="gap-1.5 text-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </Button>
          </Link>
          <Link href="/admin/registrations">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span>Review Payments ({pendingPayments.length})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link key={idx} href={kpi.href}>
              <Card className="p-5 dd-card hover:border-primary/50 transition-all h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-ink-3 uppercase">
                    {kpi.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-heading font-bold text-ink tracking-tight">
                    {kpi.value}
                  </div>
                  <p className="text-xs text-ink-2 mt-1">{kpi.subtext}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity: Registrations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-heading font-bold text-ink flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Recent Student Registrations</span>
          </h3>
          <Link href="/admin/registrations">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <span>All Registrations</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {registrations.length > 0 ? (
          <div className="rounded-2xl dd-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-alt text-ink-2 font-medium uppercase text-[11px] border-b border-hairline">
                  <tr>
                    <th className="p-4">Reg ID</th>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Year / Roll</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {registrations.slice(0, 6).map((reg) => (
                    <tr key={reg.id} className="hover:bg-surface-alt/50 transition-colors">
                      <td className="p-4 font-mono text-primary font-medium">
                        {reg.registrationNumber}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-ink">
                          {reg.primaryParticipant.fullName}
                        </div>
                        <div className="text-ink-3 text-[11px]">{reg.primaryParticipant.email}</div>
                      </td>
                      <td className="p-4 text-ink-2 max-w-[200px] truncate">
                        {reg.eventTitle}
                      </td>
                      <td className="p-4 text-ink-2">
                        {reg.primaryParticipant.year} ({reg.primaryParticipant.rollNumber})
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            reg.payment.status === "Verified"
                              ? "success"
                              : reg.payment.status === "Pending"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {reg.payment.status} {reg.payment.amount > 0 && `(₹${reg.payment.amount})`}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Link href="/admin/registrations">
                          <Button variant="secondary" size="sm" className="text-xs h-7 py-0 px-2.5">
                            Inspect
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl dd-card">
            <p className="text-ink-3 text-xs">No registrations logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
