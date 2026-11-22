"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  CreditCard,
  ExternalLink,
  Send,
  CheckSquare,
  Square,
  Users,
} from "lucide-react";
import { Registration, ARSAEvent, PaymentStatus } from "@/types";
import { getEvents, getRegistrations, updatePaymentStatus } from "@/lib/firebase/store";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<ARSAEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Screenshot viewer modal
  const [activeReg, setActiveReg] = useState<Registration | null>(null);

  // Email Broadcast Modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const refreshData = async () => {
    try {
      const [regs, evts] = await Promise.all([getRegistrations(), getEvents()]);
      setRegistrations(regs);
      setEvents(evts);
    } catch (err) {
      console.error("Registrations load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUpdateStatus = async (
    regId: string,
    newStatus: "Pending" | "Verified" | "Rejected",
    reason?: string
  ) => {
    try {
      await updatePaymentStatus(regId, newStatus, {
        verifiedBy: "Admin",
        rejectionReason: reason,
      });
      toast.success(`Registration status updated to ${newStatus}`);
      refreshData();
      if (activeReg?.id === regId) {
        setActiveReg(null);
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      if (selectedEventId !== "All" && reg.eventId !== selectedEventId) return false;
      if (selectedStatus !== "All" && reg.payment.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = reg.primaryParticipant.fullName.toLowerCase().includes(q);
        const matchesEmail = reg.primaryParticipant.email.toLowerCase().includes(q);
        const matchesRoll = reg.primaryParticipant.rollNumber.toLowerCase().includes(q);
        const matchesRegNum = reg.registrationNumber.toLowerCase().includes(q);
        const matchesUtr = reg.payment.utrNumber?.toLowerCase().includes(q);
        const matchesTeam = reg.teamName?.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesRoll || matchesRegNum || matchesUtr || matchesTeam;
      }
      return true;
    });
  }, [registrations, selectedEventId, selectedStatus, search]);

  // Checkbox handling
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredRegistrations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRegistrations.map((r) => r.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectedRegistrations = useMemo(() => {
    return registrations.filter((r) => selectedIds.has(r.id));
  }, [registrations, selectedIds]);

  const handleOpenEmailModal = (singleReg?: Registration) => {
    if (singleReg) {
      setSelectedIds(new Set([singleReg.id]));
      setEmailSubject(`Update regarding ${singleReg.eventTitle} [${singleReg.registrationNumber}]`);
      setEmailMessage(`Dear ${singleReg.primaryParticipant.fullName},\n\nThis is an official announcement from ARSA JSPM RSCOE regarding your registration for ${singleReg.eventTitle}.\n\nPlease ensure you report to the venue 15 minutes before the start time with your student ID.`);
    } else {
      if (selectedIds.size === 0) {
        toast.error("Please select at least one participant to email.");
        return;
      }
      setEmailSubject(`ARSA Announcement: Event Instructions & Schedule`);
      setEmailMessage(`Dear Participants,\n\nWe are excited to welcome you to our upcoming event organized by ARSA, Dept. of Automation & Robotics at JSPM RSCOE Pune.\n\nPlease carry your college ID card and registration confirmation.\n\nBest regards,\nARSA Organising Committee`);
    }
    setIsEmailModalOpen(true);
  };

  const handleSendBroadcastEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error("Please provide both subject and message.");
      return;
    }

    setIsSendingEmail(true);
    // Simulate sending email to all recipients
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSendingEmail(false);
    setIsEmailModalOpen(false);
    toast.success(`Email notification sent to ${selectedIds.size} participant(s)!`);
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast.error("No records to export.");
      return;
    }

    const headers = [
      "Registration ID",
      "Event Title",
      "Participant Name",
      "Email",
      "Phone",
      "Year",
      "Division",
      "Roll No",
      "Team Name",
      "Payment Status",
      "Amount",
      "UTR Number",
      "Registered At",
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.registrationNumber}"`,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.primaryParticipant.fullName.replace(/"/g, '""')}"`,
      `"${r.primaryParticipant.email}"`,
      `"${r.primaryParticipant.phone}"`,
      `"${r.primaryParticipant.year}"`,
      `"${r.primaryParticipant.division}"`,
      `"${r.primaryParticipant.rollNumber}"`,
      `"${(r.teamName || "").replace(/"/g, '""')}"`,
      `"${r.payment.status}"`,
      r.payment.amount,
      `"${r.payment.utrNumber || ""}"`,
      `"${r.createdAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arsa_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            Registrations & Payment Approvals
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Review student passes, verify UPI UTR transactions, broadcast emails, and export attendee manifests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              onClick={() => handleOpenEmailModal()}
              variant="primary"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Selected ({selectedIds.size})</span>
            </Button>
          )}
          <Button onClick={handleExportCSV} variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl dd-card flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
          <input
            type="text"
            placeholder="Search by name, roll, UTR, or pass ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface text-ink text-xs rounded-xl border border-hairline focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Event Filter */}
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3 py-2 bg-surface text-ink text-xs rounded-xl border border-hairline focus:outline-none"
          >
            <option value="All">All Events</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-surface text-ink text-xs rounded-xl border border-hairline focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Verification</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
            <option value="Free">Free Pass</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-2xl dd-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-alt text-ink-2 font-medium uppercase text-[11px] border-b border-hairline">
              <tr>
                <th className="p-3.5 w-10">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-slate-400 hover:text-white"
                    title="Select / Deselect All"
                  >
                    {filteredRegistrations.length > 0 && selectedIds.size === filteredRegistrations.length ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Registration ID</th>
                <th className="p-3.5">Participant Details</th>
                <th className="p-3.5">Event</th>
                <th className="p-3.5">Team</th>
                <th className="p-3.5">Fee & Status</th>
                <th className="p-3.5">UTR / Receipt</th>
                <th className="p-3.5 text-right">Verification & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredRegistrations.map((reg) => {
                const isSelected = selectedIds.has(reg.id);
                return (
                  <tr
                    key={reg.id}
                    className={`hover:bg-surface-alt/50 transition-colors ${
                      isSelected ? "bg-primary-soft/30" : ""
                    }`}
                  >
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleSelectOne(reg.id)}
                        className="text-ink-3 hover:text-ink"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-primary font-semibold">
                      {reg.registrationNumber}
                      <div className="text-[10px] text-ink-3 font-normal">
                        {formatDateTime(reg.createdAt)}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-ink">
                        {reg.primaryParticipant.fullName}
                      </div>
                      <div className="text-ink-2 text-[11px]">
                        {reg.primaryParticipant.year} - {reg.primaryParticipant.division} ({reg.primaryParticipant.rollNumber})
                      </div>
                      <div className="text-ink-3 text-[11px]">{reg.primaryParticipant.email}</div>
                    </td>
                    <td className="p-3.5 text-ink-2 max-w-[180px] truncate">
                      {reg.eventTitle}
                    </td>
                    <td className="p-3.5 text-ink-2">
                      {reg.teamName ? (
                        <div>
                          <span className="text-primary font-medium">{reg.teamName}</span>
                          <div className="text-[10px] text-ink-3">
                            {1 + (reg.teamMembers?.length || 0)} members
                          </div>
                        </div>
                      ) : (
                        <span className="text-ink-3 text-[11px]">Solo</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          reg.payment.status === "Verified"
                            ? "success"
                            : reg.payment.status === "Pending"
                            ? "warning"
                            : reg.payment.status === "Rejected"
                            ? "danger"
                            : "neutral"
                        }
                      >
                        {reg.payment.status} {reg.payment.amount > 0 && `(₹${reg.payment.amount})`}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-mono">
                      {reg.payment.utrNumber ? (
                        <div className="space-y-1">
                          <span className="text-ink bg-surface-alt px-1.5 py-0.5 rounded border border-hairline">
                            {reg.payment.utrNumber}
                          </span>
                          {reg.payment.screenshotUrl && (
                            <div>
                              <button
                                onClick={() => setActiveReg(reg)}
                                className="text-[11px] text-primary hover:underline flex items-center gap-1 mt-1"
                              >
                                <Eye className="w-3 h-3" /> View Slip
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">N/A (Free)</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEmailModal(reg)}
                          className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                          title="Send email to this participant"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        {reg.payment.status === "Pending" && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[11px] h-7 px-2 bg-emerald-500 text-black hover:bg-emerald-400"
                              onClick={() => handleUpdateStatus(reg.id, "Verified")}
                            >
                              <CheckCircle2 className="w-3 h-3" /> Verify
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="text-[11px] h-7 px-2"
                              onClick={() => handleUpdateStatus(reg.id, "Rejected", "Invalid UTR")}
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </Button>
                          </>
                        )}
                        {reg.payment.status === "Verified" && (
                          <button
                            onClick={() => handleUpdateStatus(reg.id, "Pending")}
                            className="text-[11px] text-slate-400 hover:text-white underline font-mono"
                          >
                            Mark Pending
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Screenshot Viewer Modal */}
      <Modal
        isOpen={Boolean(activeReg)}
        onClose={() => setActiveReg(null)}
        title={`Payment Slip: ${activeReg?.registrationNumber}`}
        description={`Participant: ${activeReg?.primaryParticipant.fullName} • UTR: ${activeReg?.payment.utrNumber || "None"}`}
        maxWidth="lg"
      >
        {activeReg && (
          <div className="space-y-4">
            {activeReg.payment.screenshotUrl ? (
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                <Image
                  src={activeReg.payment.screenshotUrl}
                  alt="Payment Screenshot"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No screenshot uploaded. Participant supplied UTR: {activeReg.payment.utrNumber}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleUpdateStatus(activeReg.id, "Rejected", "Receipt invalid")}
              >
                Reject Payment
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-500 text-black hover:bg-emerald-400"
                onClick={() => handleUpdateStatus(activeReg.id, "Verified")}
              >
                Verify & Approve Pass
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Email Broadcast Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Broadcast Email to Participants"
        description={`Sending notification to ${selectedIds.size} recipient(s)`}
        maxWidth="xl"
      >
        <form onSubmit={handleSendBroadcastEmail} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-cyber-card border border-slate-800 text-slate-300">
            <span className="font-semibold text-white">Recipients: </span>
            {selectedRegistrations.slice(0, 4).map((r) => r.primaryParticipant.email).join(", ")}
            {selectedRegistrations.length > 4 && ` and ${selectedRegistrations.length - 4} others...`}
          </div>

          <Input
            label="Email Subject"
            required
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Message Body <span className="text-accent">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="w-full p-3 bg-cyber-card rounded-lg border border-slate-700 text-foreground text-xs focus:outline-none focus:border-primary leading-relaxed"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSendingEmail} className="gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
