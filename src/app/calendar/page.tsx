"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { useLanguage } from "@/lib/i18n/language-context";
import { Calendar as CalendarIcon, Inbox } from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: "scheduled" | "draft" | "published";
  type: "video" | "reel" | "image";
}

const statusColors: Record<string, string> = {
  published: "bg-success/10 text-success",
  scheduled: "bg-info/10 text-info",
  draft: "bg-warning/10 text-warning",
};

export default function CalendarPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/calendar");
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events);
        }
      } catch {
        // Keep empty
      }
    }
    fetchEvents();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title={t("calendar.title")}
        description={t("calendar.description")}
      />

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <CalendarIcon className="h-6 w-6 text-accent" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("calendar.noEvents")}</h3>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <CalendarIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted">{event.date} • {event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted bg-sidebar-hover rounded-full px-2.5 py-1">{event.type}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[event.status]}`}>
                    {t(`posts.${event.status}` as keyof typeof t)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
