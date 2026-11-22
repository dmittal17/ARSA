"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Reply } from "lucide-react";
import { ContactMessage } from "@/types";
import { getContactMessages } from "@/lib/firebase/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error("Messages fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMessages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            Inquiries & Contact Messages
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Questions and sponsorship inquiries submitted via the public contact form.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-surface-alt rounded-2xl animate-pulse border border-hairline" />
          ))}
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="p-5 dd-card space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-hairline">
                <div>
                  <h3 className="font-heading font-semibold text-ink text-base">{msg.subject || "No Subject"}</h3>
                  <div className="flex items-center gap-3 text-xs text-ink-2 mt-0.5">
                    <span className="text-primary font-medium">{msg.name}</span>
                    <span>•</span>
                    <a href={`mailto:${msg.email}`} className="hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {msg.email}
                    </a>
                    {msg.phone && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {msg.phone}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs text-ink-3">
                  {formatDateTime(msg.createdAt)}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed whitespace-pre-line">
                {msg.message}
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "ARSA Inquiry")}`}
                  className="inline-flex"
                >
                  <Button variant="secondary" size="sm" className="text-xs gap-1.5 h-7">
                    <Reply className="w-3 h-3" />
                    <span>Reply via Email</span>
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl dd-card">
          <MessageSquare className="w-10 h-10 text-ink-3 mx-auto mb-3" />
          <p className="text-ink-2 text-sm font-medium">No messages received yet.</p>
          <p className="text-xs text-ink-3 mt-1">Inquiries submitted through /contact will appear here.</p>
        </div>
      )}
    </div>
  );
}
