"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { useLanguage } from "@/lib/i18n/language-context";
import { Users, Inbox } from "lucide-react";

interface ClientData {
  id: number;
  name: string;
  industry: string;
  status: "active" | "paused" | "prospect";
  postsManaged: number;
  followers: number;
  engagement: string;
  revenue: string;
  nextPost: string | null;
  avatar: string;
}

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
  prospect: "bg-info/10 text-info",
};

export default function ClientsPage() {
  const { t } = useLanguage();
  const [clients, setClients] = useState<ClientData[]>([]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients);
        }
      } catch {
        // Keep empty
      }
    }
    fetchClients();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title={t("clients.title")}
        description={t("clients.description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
            {t("clients.newClient")}
          </button>
        }
      />

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Users className="h-6 w-6 text-accent" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("clients.noClients")}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div key={client.id} className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent text-sm font-bold">
                  {client.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{client.name}</h3>
                  <p className="text-xs text-muted">{client.industry}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[client.status]}`}>
                  {t(`clients.${client.status}` as keyof typeof t)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-muted">
                <div>
                  <p className="font-medium text-foreground">{client.followers.toLocaleString()}</p>
                  <p>{t("clients.followers")}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{client.engagement}</p>
                  <p>{t("clients.engagement")}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{client.postsManaged}</p>
                  <p>{t("clients.postsManaged")}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{client.revenue}</p>
                  <p>{t("clients.revenue")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
