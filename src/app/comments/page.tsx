"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { comments as fallbackComments } from "@/lib/mock-data";
import {
  Search,
  Smile,
  Meh,
  Frown,
  Reply,
  CheckCheck,
  MessageSquare,
  Inbox,
} from "lucide-react";

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

interface CommentData {
  id: number;
  author: string;
  avatar: string;
  content: string;
  post: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
  replied: boolean;
}

const sentimentIcons: Record<string, React.ReactNode> = {
  positive: <Smile className="h-4 w-4 text-success" />,
  neutral: <Meh className="h-4 w-4 text-warning" />,
  negative: <Frown className="h-4 w-4 text-danger" />,
};

const sentimentBorder: Record<string, string> = {
  positive: "border-l-success",
  neutral: "border-l-warning",
  negative: "border-l-danger",
};

export default function CommentsPage() {
  const [filter, setFilter] = useState<SentimentFilter>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [comments, setComments] = useState<CommentData[]>(fallbackComments);

  useEffect(() => {
    async function fetchComments() {
      try {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("sentiment", filter);
        if (searchQuery) params.set("search", searchQuery);
        const res = await fetch(`/api/comments?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments);
        }
      } catch {
        // Keep fallback data
      }
    }
    fetchComments();
  }, [filter, searchQuery]);

  const filtered = comments;

  const selectedComment = comments.find((c) => c.id === selected);

  const counts = {
    all: comments.length,
    positive: comments.filter((c) => c.sentiment === "positive").length,
    neutral: comments.filter((c) => c.sentiment === "neutral").length,
    negative: comments.filter((c) => c.sentiment === "negative").length,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Comments Inbox"
        description="Manage and respond to comments across your posts."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Comments List */}
        <div>
          {/* Filters */}
          <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["all", "positive", "neutral", "negative"] as SentimentFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
                    filter === f ? "bg-accent text-white" : "text-muted hover:bg-sidebar-hover"
                  }`}
                >
                  {f !== "all" && sentimentIcons[f]}
                  {f} ({counts[f]})
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
              />
            </div>
          </div>

          {/* Comment list */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Inbox className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">All caught up!</h3>
                <p className="mt-1 text-sm text-muted">No comments match your filter.</p>
              </div>
            ) : (
              filtered.map((comment) => (
                <button
                  key={comment.id}
                  onClick={() => setSelected(comment.id)}
                  className={`w-full text-left rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm border-l-4 ${
                    sentimentBorder[comment.sentiment]
                  } ${selected === comment.id ? "ring-2 ring-accent" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">
                      {comment.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{comment.author}</span>
                          {sentimentIcons[comment.sentiment]}
                        </div>
                        <div className="flex items-center gap-2">
                          {comment.replied ? (
                            <span title="Replied"><CheckCheck className="h-4 w-4 text-success" /></span>
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-accent shrink-0" title="Unread" />
                          )}
                          <span className="text-xs text-muted whitespace-nowrap">{comment.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted mt-1 line-clamp-2">{comment.content}</p>
                      <p className="text-xs text-muted mt-2">
                        on <span className="font-medium text-foreground/70">{comment.post}</span>
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="hidden lg:block">
          <div className="sticky top-6 rounded-xl border border-border bg-card">
            {selectedComment ? (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent text-lg font-bold">
                    {selectedComment.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedComment.author}</p>
                    <p className="text-sm text-muted">{selectedComment.time}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {sentimentIcons[selectedComment.sentiment]}
                    <span className="text-xs font-medium capitalize">{selectedComment.sentiment}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-sidebar-hover/50 p-4 mb-4">
                  <p className="text-sm">{selectedComment.content}</p>
                  <p className="text-xs text-muted mt-3">
                    Commented on <span className="font-medium">{selectedComment.post}</span>
                  </p>
                </div>

                {selectedComment.replied ? (
                  <div className="flex items-center gap-2 rounded-lg bg-success/5 border border-success/20 p-3 text-sm text-success">
                    <CheckCheck className="h-4 w-4" />
                    <span>Reply sent</span>
                  </div>
                ) : (
                  <div>
                    <textarea
                      placeholder="Write a reply..."
                      className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <button className="text-xs text-muted hover:text-foreground transition-colors">
                        Use AI Reply
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
                        <Reply className="h-4 w-4" />
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <MessageSquare className="h-8 w-8 text-muted mb-3" />
                <p className="text-sm font-medium text-muted">Select a comment to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
