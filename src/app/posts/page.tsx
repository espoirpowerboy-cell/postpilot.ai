"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Search,
  FileText,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Inbox,
  Link2,
} from "lucide-react";
import Link from "next/link";

type StatusFilter = "all" | "published" | "scheduled" | "draft";

interface PostData {
  id: number;
  title: string;
  content: string | null;
  platform: string;
  status: "published" | "scheduled" | "draft";
  scheduledDate: string | null;
  likes: number;
  comments: number;
  shares: number;
  views: number;
}

const statusColors: Record<string, string> = {
  published: "bg-success/10 text-success",
  scheduled: "bg-info/10 text-info",
  draft: "bg-warning/10 text-warning",
};

export default function PostsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("status", filter);
        if (searchQuery) params.set("search", searchQuery);
        const res = await fetch(`/api/posts?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        }
      } catch {
        // Keep empty
      }
    }
    fetchPosts();
  }, [filter, searchQuery]);

  return (
    <DashboardLayout>
      <PageHeader
        title={t("posts.title")}
        description={t("posts.description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
            {t("posts.newPost")}
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["all", "published", "scheduled", "draft"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                filter === f ? "bg-accent text-white" : "text-muted hover:bg-sidebar-hover"
              }`}
            >
              {t(`posts.${f}` as keyof typeof t)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={t("posts.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("posts.noPosts")}</h3>
          <p className="mt-1 text-sm text-muted mb-4">{t("connect.notConnectedDesc")}</p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            <Link2 className="h-4 w-4" />
            {t("connect.connectButton")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold line-clamp-2">{post.title}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[post.status]}`}>
                  {t(`posts.${post.status}` as keyof typeof t)}
                </span>
              </div>
              {post.content && (
                <p className="text-xs text-muted line-clamp-2 mb-3">{post.content}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {post.likes.toLocaleString()}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post.comments}</span>
                <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> {post.shares}</span>
              </div>
              {post.scheduledDate && (
                <p className="text-xs text-muted mt-3 pt-3 border-t border-border">
                  {t("posts.scheduled")}: {post.scheduledDate}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
