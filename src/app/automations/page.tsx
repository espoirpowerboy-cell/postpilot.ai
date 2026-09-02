"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import { automations as fallbackAutomations } from "@/lib/mock-data";
import {
  Plus,
  Zap,
  Play,
  Pause,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface AutomationData {
  id: number;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  runs: number;
  lastRun: string;
  successRate: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: {
    label: "Active",
    color: "bg-success/10 text-success",
    icon: <Play className="h-3 w-3" />,
  },
  paused: {
    label: "Paused",
    color: "bg-warning/10 text-warning",
    icon: <Pause className="h-3 w-3" />,
  },
};

export default function AutomationsPage() {
  const [automationList, setAutomationList] = useState<AutomationData[]>(fallbackAutomations);

  useEffect(() => {
    async function fetchAutomations() {
      try {
        const res = await fetch("/api/automations");
        if (res.ok) {
          const data = await res.json();
          setAutomationList(data.automations);
        }
      } catch {
        // Keep fallback data
      }
    }
    fetchAutomations();
  }, []);

  const toggleAutomation = (id: number) => {
    setAutomationList((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? ("paused" as const) : ("active" as const) }
          : a
      )
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Automations"
        description="Automate repetitive tasks and focus on creating great content."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors">
            <Plus className="h-4 w-4" />
            New Automation
          </button>
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <Zap className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{automationList.filter((a) => a.status === "active").length}</p>
            <p className="text-xs text-muted">Active automations</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
            <CheckCircle2 className="h-5 w-5 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">{automationList.reduce((acc, a) => acc + a.runs, 0).toLocaleString()}</p>
            <p className="text-xs text-muted">Total runs</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold">96.3%</p>
            <p className="text-xs text-muted">Avg success rate</p>
          </div>
        </div>
      </div>

      {/* Automation cards */}
      <div className="space-y-4">
        {automationList.map((auto) => {
          const status = statusConfig[auto.status];
          return (
            <div
              key={auto.id}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">{auto.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-3">{auto.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted">
                        <span className="font-medium text-foreground/70">Trigger:</span>
                        <span className="rounded-md bg-sidebar-hover px-2 py-0.5 text-xs font-medium">{auto.trigger}</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted" />
                      <div className="flex items-center gap-2 text-muted">
                        <span className="font-medium text-foreground/70">Action:</span>
                        <span className="rounded-md bg-sidebar-hover px-2 py-0.5 text-xs font-medium">{auto.action}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAutomation(auto.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      auto.status === "active" ? "bg-success" : "bg-border"
                    }`}
                    title={auto.status === "active" ? "Pause" : "Activate"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        auto.status === "active" ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <button className="rounded-lg p-2 text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-4 flex items-center gap-6 border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-sm text-muted">
                  <Play className="h-3.5 w-3.5" />
                  <span className="font-medium">{auto.runs.toLocaleString()}</span> runs
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span className="font-medium">{auto.successRate}%</span> success
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  Last run: {auto.lastRun}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
