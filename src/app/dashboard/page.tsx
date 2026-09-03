"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Calendar,
  FileText,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Zap,
  BarChart3,
  TrendingUp,
  Inbox,
  Link2,
} from "lucide-react";
import Link from "next/link";

interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface ActivityItem {
  id: number;
  type: "post" | "comment" | "automation" | "error" | "client";
  message: string;
  time: string;
  status: "success" | "info" | "error";
}

const statusIcons: Record<string, React.ReactNode> = {
  post: <FileText className="h-4 w-4" />,
  comment: <MessageSquare className="h-4 w-4" />,
  automation: <Zap className="h-4 w-4" />,
  error: <Zap className="h-4 w-4" />,
  client: <BarChart3 className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  error: "bg-danger/10 text-danger",
};

function MiniChart({ totalViews }: { totalViews: string }) {
  const points = [40, 55, 35, 70, 45, 85, 60, 75, 50, 90, 65, 80];
  const width = 400;
  const height = 120;
  const step = width / (points.length - 1);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const pathPoints = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * (height - 20) - 10;
    return `${x},${y}`;
  });

  const linePath = `M${pathPoints.join(" L")}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted">Views Over Time</h3>
          <p className="text-2xl font-bold mt-1">{totalViews}</p>
        </div>
        <div className="flex items-center gap-1 text-success text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          <span>—</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGrad)" />
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ScheduledPosts() {
  const [posts, setPosts] = useState<{ title: string; time: string; type: string }[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts?status=scheduled");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts?.slice(0, 3) ?? []);
        }
      } catch {
        // Keep empty
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted">Upcoming Posts</h3>
        <Link href="/calendar" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="h-8 w-8 text-muted mb-2" />
          <p className="text-sm text-muted">No upcoming posts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <FileText className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted">{post.time}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted bg-sidebar-hover rounded-full px-2.5 py-1">{post.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setActivity(data.activity);
        }
      } catch {
        // Keep empty state
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const quickActions = [
    { label: t("dashboard.schedulePost"), href: "/calendar", icon: Calendar, color: "bg-accent" },
    { label: t("dashboard.writeWithAI"), href: "/ai-assistant", icon: Sparkles, color: "bg-purple-500" },
    { label: t("dashboard.viewAnalytics"), href: "/analytics", icon: BarChart3, color: "bg-emerald-500" },
    { label: t("dashboard.replyToComments"), href: "/comments", icon: MessageSquare, color: "bg-amber-500" },
  ];

  const totalViews = stats.find((s) => s.label === "Total Views")?.value ?? "0";

  return (
    <DashboardLayout>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.welcome")}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-accent/30"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{action.label}</p>
              <p className="text-xs text-muted group-hover:text-accent transition-colors flex items-center gap-1">
                Go <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Connect TikTok CTA if no data */}
      {!loading && stats.every((s) => s.value === "0") && (
        <div className="rounded-xl border border-dashed border-accent/30 bg-accent/5 p-8 mb-8 text-center">
          <Link2 className="h-10 w-10 text-accent mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">{t("dashboard.connectTikTok")}</h3>
          <p className="text-sm text-muted mb-4">{t("connect.notConnectedDesc")}</p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            {t("connect.connectButton")}
          </Link>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <MiniChart totalViews={totalViews} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted mb-4">{t("dashboard.recentActivity")}</h3>
          {activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Inbox className="h-8 w-8 text-muted mb-2" />
              <p className="text-sm text-muted">{t("dashboard.noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusColors[item.status]}`}>
                    {statusIcons[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Posts */}
        <ScheduledPosts />
      </div>
    </DashboardLayout>
  );
}
