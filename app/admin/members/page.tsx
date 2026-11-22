"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Download, CheckCircle, Clock, XCircle, UserCheck } from "lucide-react";
import { MemberApplication } from "@/types";
import { getMemberApplications, updateMemberStatus } from "@/lib/firebase/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");

  const refreshMembers = async () => {
    try {
      const data = await getMemberApplications();
      setMembers(data);
    } catch (err) {
      console.error("Members fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMembers();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: "Pending" | "Interviewed" | "Selected" | "Rejected"
  ) => {
    try {
      await updateMemberStatus(id, newStatus);
      toast.success(`Application status updated to ${newStatus}`);
      refreshMembers();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleExportCSV = () => {
    if (members.length === 0) {
      toast.error("No applications to export.");
      return;
    }

    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Year",
      "Branch",
      "Division",
      "Roll Number",
      "Preferred Domain",
      "Past Experience",
      "Why Join",
      "Status",
      "Submitted At",
    ];

    const rows = members.map((m) => [
      m.id,
      `"${m.fullName.replace(/"/g, '""')}"`,
      m.email,
      m.phone,
      m.year,
      m.branch,
      m.division,
      m.rollNumber,
      `"${m.preferredDomain}"`,
      `"${(m.pastExperience || "").replace(/"/g, '""')}"`,
      `"${m.whyJoin.replace(/"/g, '""')}"`,
      m.status || "Pending",
      m.submittedAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arsa_member_recruitment_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded!");
  };

  const filtered = members.filter((m) => {
    if (selectedDomain !== "All" && m.preferredDomain !== selectedDomain) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchRoll = m.rollNumber.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      return matchName || matchRoll || matchEmail;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            Membership Applications
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Review student candidates applying for core domains (Robotics, Software, Design, Events, PR).
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="secondary" size="sm" className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5 text-primary" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl dd-card flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
          <input
            type="text"
            placeholder="Search candidate name or roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface text-ink text-xs rounded-xl border border-hairline focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="px-3 py-2 bg-surface text-ink text-xs rounded-xl border border-hairline focus:outline-none w-full sm:w-auto"
        >
          <option value="All">All Domains</option>
          <option value="Technical Robotics">Technical Robotics</option>
          <option value="Software & Web">Software & Web</option>
          <option value="Design & Media">Design & Media</option>
          <option value="Event Management">Event Management</option>
          <option value="Sponsorship & PR">Sponsorship & PR</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl dd-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-alt text-ink-2 font-medium uppercase text-[11px] border-b border-hairline">
              <tr>
                <th className="p-3.5">Candidate</th>
                <th className="p-3.5">Year / Roll</th>
                <th className="p-3.5">Domain</th>
                <th className="p-3.5">Motivation & Experience</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Recruitment Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-ink">{app.fullName}</div>
                    <div className="text-[11px] text-ink-3 font-mono">{app.email}</div>
                    <div className="text-[11px] text-ink-3 font-mono">{app.phone}</div>
                  </td>
                  <td className="p-3.5 text-ink-2">
                    <div>{app.year} - Div {app.division}</div>
                    <div className="text-[11px] text-ink-3">{app.rollNumber}</div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="primary">{app.preferredDomain}</Badge>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <p className="text-ink-2 line-clamp-2">{app.whyJoin}</p>
                    {app.pastExperience && (
                      <p className="text-[11px] text-primary truncate mt-0.5 font-medium">
                        Skills: {app.pastExperience}
                      </p>
                    )}
                  </td>
                  <td className="p-3.5">
                    <Badge
                      variant={
                        app.status === "Selected"
                          ? "success"
                          : app.status === "Interviewed"
                          ? "warning"
                          : app.status === "Rejected"
                          ? "danger"
                          : "neutral"
                      }
                    >
                      {app.status || "Pending"}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-6 px-2 text-emerald-600 dark:text-emerald-400"
                        onClick={() => handleStatusChange(app.id, "Selected")}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-6 px-2 text-amber-600 dark:text-amber-400"
                        onClick={() => handleStatusChange(app.id, "Interviewed")}
                      >
                        Interview
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[11px] h-6 px-2 text-rose-600 dark:text-rose-400"
                        onClick={() => handleStatusChange(app.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
