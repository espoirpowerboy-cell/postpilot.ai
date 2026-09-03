"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Download,
  TrendingUp,
  Link2,
} from "lucide-react";
import Link from "next/link";

interface ViewsDataPoint { date: string; views: number; }
interface EngagementData { type: string; count: number; percentage: number; }
interface TopPostData { title: string; views: number; likes: number; engagement: string; }
interface FollowersDataPoint { date: string; followers: number; }
interface AudienceDemographics { age: { range: string; percentage: number }[]; gender: { type: string; percentage: number }[]; topLocations: { city: string; percentage: number }[]; }

interface AnalyticsOverview {
  viewsOverTime: ViewsDataPoint[];
  engagementByType: EngagementData[];
  topPosts: TopPostData[];
  audienceGrowth: FollowersDataPoint[];
  demographics: AudienceDemographics;
}

interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

function ViewsChart({ data }: { data: ViewsDataPoint[] }) {
  if (data.length === 0) return null;

  const width = 800;
  const height = 200;
  const max = Math.max(...data.map((d) => d.views));
  const min = Math.min(...data.map((d) => d.views));
  const range = max - min || 1;
  const padding = { left: 0, right: 0, top: 10, bottom: 0 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const step = chartW / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = padding.left + i * step;
    const y = padding.top + chartH - ((d.views - min) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`;
  const areaPath = `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  const totalViews = data.reduce((s, d) => s + d.views, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-muted">Views Over Time</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold">{totalViews >= 1000000 ? `${(totalViews / 1000000).toFixed(1)}M` : totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--card)" stroke="var(--accent)" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-3 text-xs text-muted">
        {data.map((d) => (
          <span key={d.date}>{d.date.split(" ")[1] ?? d.date}</span>
        ))}
      </div>
    </div>
  );
}

function EngagementChart({ data }: { data: EngagementData[] }) {
  if (data.length === 0) return null;

  const colors = ["bg-accent", "bg-emerald-500", "bg-amber-500"];
  const strokeColors = ["var(--accent)", "#10b981", "#f59e0b"];
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-medium text-muted mb-4">Engagement Breakdown</h3>
      <div className="flex items-center gap-8">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {data.map((d, i) => {
              const prev = data.slice(0, i).reduce((acc, item) => acc + item.percentage, 0);
              const circumference = 2 * Math.PI * 38;
              const dashArray = `${(d.percentage / 100) * circumference} ${circumference}`;
              const dashOffset = -((prev / 100) * circumference);
              return (
                <circle key={i} cx="50" cy="50" r="38" fill="none" stroke={strokeColors[i]} strokeWidth="8" strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold">{total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total}</p>
              <p className="text-[10px] text-muted">Total</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((d, i) => (
            <div key={d.type}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${colors[i]}`} />
                  <span className="font-medium">{d.type}</span>
                </div>
                <span className="text-muted">{d.count.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopPostsTable({ posts }: { posts: TopPostData[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-medium text-muted mb-4">Top Performing Posts</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Post</th>
              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Views</th>
              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Likes</th>
              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-3 text-sm font-medium">{post.title}</td>
                <td className="py-3 text-right text-sm text-muted">{(post.views / 1000).toFixed(0)}K</td>
                <td className="py-3 text-right text-sm text-muted">{(post.likes / 1000).toFixed(1)}K</td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    {post.engagement}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AudienceGrowthChart({ data }: { data: FollowersDataPoint[] }) {
  if (data.length === 0) return null;

  const width = 400;
  const height = 150;
  const max = Math.max(...data.map((d) => d.followers));
  const min = Math.min(...data.map((d) => d.followers));
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);

  const points = data.map((d, i) => ({
    x: i * step,
    y: 10 + (height - 20) - ((d.followers - min) / range) * (height - 20),
  }));

  const linePath = `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`;
  const areaPath = `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted">Audience Growth</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold">{data[data.length - 1]?.followers.toLocaleString() ?? "0"}</p>
            <span className="flex items-center gap-1 text-sm font-medium text-success">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28">
        <defs>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--success)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#growthGrad)" />
        <path d={linePath} fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between mt-2 text-xs text-muted">
        {data.map((d) => (
          <span key={d.date}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsOverview>({
    viewsOverTime: [],
    engagementByType: [],
    topPosts: [],
    audienceGrowth: [],
    demographics: { age: [], gender: [], topLocations: [] },
  });
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [analyticsRes, dashboardRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/dashboard"),
        ]);
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data);
        }
        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setStats(data.stats);
        }
      } catch {
        // Keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const hasData = analytics.viewsOverTime.length > 0 || analytics.topPosts.length > 0;

  return (
    <DashboardLayout>
      <PageHeader
        title={t("analytics.title")}
        description={t("analytics.description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-sidebar-hover transition-colors">
            <Download className="h-4 w-4" />
            {t("analytics.exportReport")}
          </button>
        }
      />

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasData && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <TrendingUp className="h-6 w-6 text-accent" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("analytics.noData")}</h3>
          <p className="mt-1 text-sm text-muted mb-4">{t("connect.notConnectedDesc")}</p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            <Link2 className="h-4 w-4" />
            {t("connect.connectButton")}
          </Link>
        </div>
      )}

      {/* Charts grid */}
      {hasData && (
        <>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <ViewsChart data={analytics.viewsOverTime} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            <div className="lg:col-span-2">
              <AudienceGrowthChart data={analytics.audienceGrowth} />
            </div>
            <div>
              <EngagementChart data={analytics.engagementByType} />
            </div>
          </div>

          <TopPostsTable posts={analytics.topPosts} />
        </>
      )}
    </DashboardLayout>
  );
}
