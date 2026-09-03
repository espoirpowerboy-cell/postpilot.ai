"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { useLanguage } from "@/lib/i18n/language-context";
import { Zap, Inbox } from "lucide-react";

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

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
};

export default function AutomationsPage() {
  const { t } = useLanguage();
  const [automations, setAutomations] = useState<AutomationData[]>([]);

  useEffect(() => {
    async function fetchAutomations() {
      try {
        const res = await fetch("/api/automations");
        if (res.ok) {
          const data = await res.json();
          setAutomations(data.automations);
        }
      } catch {
        // Keep empty
      }
    }
    fetchAutomations();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title={t("automations.title")}
        description={t("automations.description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
            {t("automations.newAutomation")}
          </button>
        }
      />

      {automations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Zap className="h-6 w-6 text-accent" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("automations.noAutomations")}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {automations.map((auto) => (
            <div key={auto.id} className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold">{auto.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[auto.status]}`}>
                  {t(`automations.${auto.status}` as keyof typeof t)}
                </span>
              </div>
              <p className="text-xs text-muted mb-3">{auto.description}</p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{auto.runs} {t("automations.runs")}</span>
                <span>{auto.successRate}%</span>
              </div>
              <p className="text-xs text-muted mt-2">
                {t("automations.lastRun")}: {auto.lastRun}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
