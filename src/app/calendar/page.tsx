"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { calendarEvents as fallbackEvents } from "@/lib/mock-data";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  Image,
  CalendarDays,
} from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: "scheduled" | "draft" | "published";
  type: "video" | "reel" | "image";
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am to 7pm

const statusStyles: Record<string, string> = {
  scheduled: "bg-info/10 border-info/30 text-info",
  draft: "bg-warning/10 border-warning/30 text-warning",
  published: "bg-success/10 border-success/30 text-success",
};

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-3 w-3" />,
  reel: <Video className="h-3 w-3" />,
  image: <Image className="h-3 w-3" />,
};

export default function CalendarPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [events, setEvents] = useState<CalendarEvent[]>(fallbackEvents);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/calendar");
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events);
        }
      } catch {
        // Keep fallback data
      }
    }
    fetchEvents();
  }, []);

  // Generate dates for the current week view
  const baseDate = new Date(2026, 8, 1); // Sep 1, 2026 (Monday)
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const monthLabel = weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <DashboardLayout>
      <PageHeader
        title="Content Calendar"
        description="Plan and schedule your content ahead of time."
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors">
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </>
        }
      />

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset(0)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-sidebar-hover transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="rounded-lg p-1.5 hover:bg-sidebar-hover transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="rounded-lg p-1.5 hover:bg-sidebar-hover transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-lg font-semibold">{monthLabel}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button className="px-3 py-1.5 text-sm font-medium bg-accent text-white">Week</button>
            <button className="px-3 py-1.5 text-sm font-medium text-muted hover:bg-sidebar-hover transition-colors">Month</button>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-border">
          <div className="p-2" />
          {weekDates.map((date, i) => {
            const isToday = date.toISOString().split("T")[0] === "2026-09-01";
            return (
              <div
                key={i}
                className={`p-3 text-center border-l border-border ${i === 0 ? "border-l-0" : ""}`}
              >
                <p className="text-xs font-medium text-muted">{daysOfWeek[i]}</p>
                <p className={`mt-1 text-lg font-semibold ${isToday ? "text-accent" : ""}`}>
                  {isToday ? (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-sm">
                      {date.getDate()}
                    </span>
                  ) : (
                    date.getDate()
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[72px_repeat(7,1fr)] max-h-[600px] overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="p-2 text-right pr-3 border-b border-border">
                <span className="text-xs text-muted">{hour > 12 ? `${hour - 12} PM` : `${hour} AM`}</span>
              </div>
              {weekDates.map((date, di) => {
                const dateStr = formatDate(date);
                const dayEvents = events.filter(
                  (e) => e.date === dateStr && parseInt(e.time) === hour
                );
                return (
                  <div
                    key={di}
                    className={`border-b border-l border-border p-1 min-h-[48px] hover:bg-sidebar-hover/50 transition-colors cursor-pointer ${di === 0 ? "border-l-0" : ""}`}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`rounded-md border px-2 py-1 text-xs font-medium cursor-pointer hover:shadow-sm transition-shadow ${statusStyles[event.status]}`}
                      >
                        <div className="flex items-center gap-1">
                          {typeIcons[event.type]}
                          <span className="truncate">{event.title}</span>
                        </div>
                        <p className="text-[10px] opacity-75 mt-0.5">{event.time}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming list for mobile */}
      <div className="mt-8 lg:hidden">
        <h3 className="text-sm font-medium text-muted mb-3">Upcoming Posts</h3>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <CalendarDays className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {event.time}
                </p>
              </div>
              <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusStyles[event.status].split(" ").slice(0, 2).join(" ")}`}>
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
