"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import { stats as fallbackStats, recentActivity as fallbackActivity } from "@/lib/mock-data";
import {
  Calendar,
  FileText,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Zap,
  BarChart3,
  TrendingUp,
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

const quickActions = [
  { label: "Schedule Post", href: "/calendar", icon: Calendar, color: "bg-accent" },
  { label: "Write with AI", href: "/ai-assistant", icon: Sparkles, color: "bg-purple-500" },
  { label: "View Analytics", href: "/analytics", icon: BarChart3, color: "bg-emerald-500" },
  { label: "Reply to Comments", href: "/comments", icon: MessageSquare, color: "bg-amber-500" },
];

function MiniChart() {
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
          <p className="text-2xl font-bold mt-1">3.2M</p>
        </div>
        <div className="flex items-center gap-1 text-success text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          <span>+18.2%</span>
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
      <div className="flex justify-between mt-2 text-xs text-muted">
        <span>Aug 26</span>
        <span>Sep 1</span>
      </div>
    </div>
  );
}

function EngagementBreakdown() {
  const items = [
    { label: "Likes", value: "125.4K", width: "65%", color: "bg-accent" },
    { label: "Comments", value: "3,672", width: "12%", color: "bg-emerald-500" },
    { label: "Shares", value: "9,890", width: "23%", color: "bg-amber-500" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-medium text-muted mb-4">Engagement Breakdown</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: item.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduledPosts() {
  const posts = [
    { title: "Behind the Scenes Reel", time: "Tomorrow, 2:00 PM", type: "Reel" },
    { title: "Q&A Response Video", time: "Sep 3, 11:00 AM", type: "Video" },
    { title: "Trend Challenge", time: "Sep 4, 3:00 PM", type: "Video" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted">Upcoming Posts</h3>
        <Link href="/calendar" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
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
    </div>
  );
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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStat[]>(fallbackStats);
  const [activity, setActivity] = useState<ActivityItem[]>(fallbackActivity);
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
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Alex. Here's what's happening with your content."
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

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <MiniChart />
        </div>
        <div>
          <EngagementBreakdown />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted mb-4">Recent Activity</h3>
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
        </div>

        {/* Scheduled Posts */}
        <ScheduledPosts />
      </div>
    </DashboardLayout>
  );
}
