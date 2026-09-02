"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import { posts as fallbackPosts } from "@/lib/mock-data";
import {
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MoreHorizontal,
  FileText,
  Calendar,
} from "lucide-react";

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
  thumbnail: null;
}

const statusStyles: Record<string, string> = {
  published: "bg-success/10 text-success",
  scheduled: "bg-info/10 text-info",
  draft: "bg-warning/10 text-warning",
};

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function PostsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<PostData[]>(fallbackPosts);

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
        // Keep fallback data
      }
    }
    fetchPosts();
  }, [filter, searchQuery]);

  const filtered = posts;

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    draft: posts.filter((p) => p.status === "draft").length,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Posts"
        description="Manage all your content in one place."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors">
            <Plus className="h-4 w-4" />
            Create Post
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["all", "published", "scheduled", "draft"] as StatusFilter[]).map((f) => (
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
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
      </div>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts found"
          description={filter === "all" ? "Create your first post to get started." : `No ${filter} posts found. Try a different filter.`}
          action={
            <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
              <Plus className="h-4 w-4" /> Create Post
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-1 uppercase tracking-wider ${statusStyles[post.status]}`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-muted">{post.platform}</span>
                    {post.scheduledDate && (
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted line-clamp-2">{post.content}</p>
                </div>
                <button className="rounded-lg p-2 text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {post.status === "published" && (
                <div className="mt-4 flex items-center gap-6 border-t border-border pt-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{formatNumber(post.views)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">{formatNumber(post.comments)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <Share2 className="h-4 w-4" />
                    <span className="font-medium">{formatNumber(post.shares)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
