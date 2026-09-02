"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import { clients as fallbackClients } from "@/lib/mock-data";
import {
  Search,
  Users,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Eye,
  UserPlus,
} from "lucide-react";

type StatusFilter = "all" | "active" | "paused" | "prospect";

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

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
  prospect: "bg-info/10 text-info",
};

const avatarColors: Record<string, string> = {
  TC: "bg-blue-500",
  GL: "bg-emerald-500",
  US: "bg-purple-500",
  FP: "bg-amber-500",
  AC: "bg-rose-500",
  WT: "bg-cyan-500",
};

export default function ClientsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [clientList, setClientList] = useState<ClientData[]>(fallbackClients);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setClientList(data.clients);
        }
      } catch {
        // Keep fallback data
      }
    }
    fetchClients();
  }, []);

  const filtered = clientList.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: clientList.length,
    active: clientList.filter((c) => c.status === "active").length,
    paused: clientList.filter((c) => c.status === "paused").length,
    prospect: clientList.filter((c) => c.status === "prospect").length,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Clients"
        description="Manage your client accounts and track their performance."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors">
            <UserPlus className="h-4 w-4" />
            Add Client
          </button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold">{counts.active}</p>
            <p className="text-xs text-muted">Active clients</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">$10.1K</p>
            <p className="text-xs text-muted">Monthly revenue</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
            <Eye className="h-5 w-5 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">903K</p>
            <p className="text-xs text-muted">Total reach</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["all", "active", "paused", "prospect"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                filter === f ? "bg-accent text-white" : "text-muted hover:bg-sidebar-hover"
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients found"
          description={filter === "all" ? "Add your first client to get started." : `No ${filter} clients found.`}
          action={
            <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
              <UserPlus className="h-4 w-4" /> Add Client
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${avatarColors[client.avatar] || "bg-accent"} text-white text-lg font-bold`}>
                    {client.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold group-hover:text-accent transition-colors">{client.name}</h3>
                    <p className="text-xs text-muted">{client.industry}</p>
                  </div>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[client.status]}`}>
                  {client.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted">Followers</p>
                  <p className="text-sm font-semibold">{(client.followers / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Engagement</p>
                  <p className="text-sm font-semibold">{client.engagement}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Posts Managed</p>
                  <p className="text-sm font-semibold">{client.postsManaged}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Revenue</p>
                  <p className="text-sm font-semibold">{client.revenue}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                {client.nextPost ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    Next post: {new Date(client.nextPost).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                ) : (
                  <span className="text-xs text-muted">No upcoming posts</span>
                )}
                <button className="rounded-lg p-1.5 text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
