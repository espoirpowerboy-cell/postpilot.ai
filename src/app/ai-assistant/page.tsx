"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import {
  Sparkles,
  Send,
  Lightbulb,
  Hash,
  PenLine,
  Video,
  TrendingUp,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Wand2,
  MessageSquare,
} from "lucide-react";

const suggestedPrompts = [
  { icon: PenLine, label: "Write a viral caption", prompt: "Write a viral TikTok caption for a product launch video" },
  { icon: Hash, label: "Generate hashtags", prompt: "Generate trending hashtags for a fitness content creator" },
  { icon: TrendingUp, label: "Content ideas", prompt: "Give me 10 content ideas for a tech brand on TikTok this week" },
  { icon: Video, label: "Script ideas", prompt: "Write a 30-second video script for a tutorial about our new feature" },
];

const toolCards = [
  { icon: PenLine, title: "Caption Generator", description: "Generate engaging captions for your posts", color: "bg-accent" },
  { icon: Hash, title: "Hashtag Research", description: "Find the best hashtags for maximum reach", color: "bg-purple-500" },
  { icon: TrendingUp, title: "Trend Analyzer", description: "Discover trending topics in your niche", color: "bg-emerald-500" },
  { icon: Video, title: "Script Writer", description: "Write compelling video scripts in seconds", color: "bg-amber-500" },
  { icon: Lightbulb, title: "Content Ideas", description: "Get fresh ideas for your content calendar", color: "bg-rose-500" },
  { icon: MessageSquare, title: "Comment Replies", description: "Craft thoughtful replies to your audience", color: "bg-cyan-500" },
];

const mockConversation = [
  {
    role: "user" as const,
    content: "Write a viral caption for a product launch video about our new AI-powered content scheduler",
  },
  {
    role: "assistant" as const,
    content: `Here are 3 caption options for your product launch:

**Option 1:**
🚀 The future of content creation is HERE. Our AI-powered scheduler doesn't just post — it learns, adapts, and optimizes your content for maximum impact. Ready to let AI handle the heavy lifting? ✨ #ContentCreation #AI #ProductLaunch

**Option 2:**
POV: You just discovered the secret weapon behind every viral creator 🤯 Our new AI scheduler finds the perfect time, writes the perfect caption, and watches the analytics roll in. Link in bio 🔗 #CreatorTools #AIRevolution

**Option 3:**
Stop guessing. Start growing. 📈 Our AI scheduler analyzes YOUR audience, YOUR content, and YOUR competitors to post at the perfect moment. Welcome to smart content creation. 🧠 #MarketingTips #AITools`,
  },
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState(mockConversation);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "tools">("chat");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      {
        role: "assistant",
        content: "I'm working on that! This is a demo response. In production, this would connect to an AI model to generate real content based on your request.",
      },
    ]);
    setInput("");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Assistant"
        description="Let AI help you create amazing content, faster."
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 rounded-lg border border-border bg-card p-1 w-fit">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "chat" ? "bg-accent text-white" : "text-muted hover:bg-sidebar-hover"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "tools" ? "bg-accent text-white" : "text-muted hover:bg-sidebar-hover"
          }`}
        >
          <Wand2 className="h-4 w-4" />
          Tools
        </button>
      </div>

      {activeTab === "chat" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Chat area */}
          <div className="rounded-xl border border-border bg-card flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-br-md"
                        : "bg-sidebar-hover text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-xs font-semibold text-accent">PostPilot AI</span>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                        <button className="rounded p-1 hover:bg-sidebar-active transition-colors" title="Copy">
                          <Copy className="h-3.5 w-3.5 text-muted" />
                        </button>
                        <button className="rounded p-1 hover:bg-sidebar-active transition-colors" title="Regenerate">
                          <RefreshCw className="h-3.5 w-3.5 text-muted" />
                        </button>
                        <button className="rounded p-1 hover:bg-sidebar-active transition-colors" title="Good response">
                          <ThumbsUp className="h-3.5 w-3.5 text-muted" />
                        </button>
                        <button className="rounded p-1 hover:bg-sidebar-active transition-colors" title="Bad response">
                          <ThumbsDown className="h-3.5 w-3.5 text-muted" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI to help with your content..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Suggestions sidebar */}
          <div className="hidden lg:block">
            <h3 className="text-sm font-semibold mb-3">Quick Prompts</h3>
            <div className="space-y-2">
              {suggestedPrompts.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s.prompt)}
                  className="w-full text-left rounded-xl border border-border bg-card p-3 transition-all hover:shadow-sm hover:border-accent/30"
                >
                  <div className="flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold">Pro Tip</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Be specific in your prompts. Mention your brand voice, target audience, and desired tone for better results.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Tools Tab */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolCards.map((tool, i) => (
            <button
              key={i}
              className="group text-left rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/20"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.color} text-white mb-4`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">{tool.title}</h3>
              <p className="text-sm text-muted">{tool.description}</p>
            </button>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
