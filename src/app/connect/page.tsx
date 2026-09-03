"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Link2,
  Check,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Calendar,
  Sparkles,
  Users,
  Heart,
  PlayCircle,
  TrendingUp,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface TikTokAccountData {
  id?: string;
  username: string;
  displayName: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  verified: boolean;
  bio: string;
  profileViews: number;
  isProAccount: boolean;
  connected: boolean;
  avatarUrl?: string | null;
  connectedAt?: string | null;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 00-.81-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.08a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3-.82V6.69h3z" fill="currentColor" />
  </svg>
);

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function ConnectPage() {
  const { t } = useLanguage();
  const [account, setAccount] = useState<TikTokAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccount() {
      try {
        const res = await fetch("/api/tiktok/status");
        if (res.ok) {
          const data = await res.json();
          setAccount(data.account);
        } else {
          setAccount(null);
        }
      } catch {
        setAccount(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get("success");
    const errorParam = params.get("error");

    if (successParam) {
      setSuccess(successParam === "tiktok_connected" ? "TikTok account connected successfully!" : successParam);
      window.history.replaceState({}, "", "/connect");
    }
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      window.history.replaceState({}, "", "/connect");
    }
  }, []);

  function handleConnect() {
    setConnecting(true);
    setError(null);
    window.location.href = "/api/tiktok/connect";
  }

  async function handleDisconnect() {
    if (!confirm(t("connect.disconnectConfirm"))) return;

    setDisconnecting(true);
    setError(null);

    try {
      const res = await fetch("/api/tiktok/disconnect", { method: "POST" });
      if (res.ok) {
        setAccount(null);
        setSuccess("TikTok account disconnected.");
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to disconnect");
      }
    } catch {
      setError("Failed to disconnect. Please try again.");
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/tiktok/sync", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setSuccess(t("connect.syncSuccess"));
        // Refresh account data
        const statusRes = await fetch("/api/tiktok/status");
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setAccount(statusData.account);
        }
      } else {
        setError(data.error ?? t("connect.syncError"));
      }
    } catch {
      setError(t("connect.syncError"));
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title={t("connect.title")} description={t("connect.description")} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      </DashboardLayout>
    );
  }

  const isConnected = account?.connected === true;

  const features = [
    { icon: Calendar, title: t("connect.smartScheduling"), description: t("connect.smartSchedulingDesc") },
    { icon: Sparkles, title: t("connect.aiContentAssistant"), description: t("connect.aiContentAssistantDesc") },
    { icon: BarChart3, title: t("connect.advancedAnalytics"), description: t("connect.advancedAnalyticsDesc") },
    { icon: MessageSquare, title: t("connect.commentManagement"), description: t("connect.commentManagementDesc") },
    { icon: Zap, title: t("connect.automationsFeature"), description: t("connect.automationsFeatureDesc") },
    { icon: Users, title: t("connect.teamCollaboration"), description: t("connect.teamCollaborationDesc") },
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t("connect.title")} description={t("connect.description")} />

      {success && (
        <div className="mb-6 rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-sm text-success flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {!isConnected && (
        <>
          <div className="rounded-2xl border border-border bg-card p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff0050]/5 via-transparent to-purple-500/5" />
            <div className="relative flex flex-col items-center text-center max-w-lg mx-auto">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff0050]/10 mb-4">
                <TikTokIcon className="h-8 w-8 text-[#ff0050]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("connect.notConnected")}</h2>
              <p className="text-muted mb-6">{t("connect.notConnectedDesc")}</p>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ff0050] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#e00045] hover:shadow-xl transition-all disabled:opacity-50"
              >
                {connecting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <TikTokIcon className="h-5 w-5" />
                )}
                {connecting ? t("connect.redirecting") : t("connect.connectButton")}
              </button>
              <p className="text-xs text-muted mt-3">{t("connect.redirectNote")}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("connect.whatYoullUnlock")}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-3">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="text-sm font-semibold mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isConnected && account && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff0050]/10 overflow-hidden">
                {account.avatarUrl ? (
                  <img src={account.avatarUrl} alt={account.displayName} className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  <TikTokIcon className="h-8 w-8 text-[#ff0050]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{account.displayName}</h3>
                  {account.verified && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                  )}
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">{t("connect.connected")}</span>
                </div>
                <p className="text-sm text-muted">{account.username}</p>
                {account.bio && <p className="text-sm text-muted mt-1">{account.bio}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {syncing ? t("connect.syncing") : t("connect.syncData")}
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-danger hover:bg-danger/5 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {disconnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("connect.disconnect")}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <Users className="h-5 w-5 text-muted mx-auto mb-1" />
              <p className="text-xl font-bold">{formatNumber(account.followers)}</p>
              <p className="text-xs text-muted">{t("connect.followers")}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <PlayCircle className="h-5 w-5 text-muted mx-auto mb-1" />
              <p className="text-xl font-bold">{account.videos}</p>
              <p className="text-xs text-muted">{t("connect.videos")}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <Heart className="h-5 w-5 text-muted mx-auto mb-1" />
              <p className="text-xl font-bold">{formatNumber(account.likes)}</p>
              <p className="text-xs text-muted">{t("connect.totalLikes")}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <TrendingUp className="h-5 w-5 text-muted mx-auto mb-1" />
              <p className="text-xl font-bold">{account.isProAccount ? t("connect.pro") : t("connect.standard")}</p>
              <p className="text-xs text-muted">{t("connect.accountType")}</p>
            </div>
          </div>

          {account.connectedAt && (
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted">{t("connect.connectedSince")}: {new Date(account.connectedAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
