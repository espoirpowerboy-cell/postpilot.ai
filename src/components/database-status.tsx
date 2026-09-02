"use client";

import { useState, useEffect } from "react";
import { Database, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface HealthStatus {
  status: "healthy" | "unhealthy" | "not_configured";
  database: {
    configured: boolean;
    connected: boolean;
    latencyMs: number | null;
    error: string | null;
  };
}

export default function DatabaseStatus({ collapsed }: { collapsed?: boolean }) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setHealth(data);
      } catch {
        setHealth({
          status: "not_configured",
          database: {
            configured: false,
            connected: false,
            latencyMs: null,
            error: "Could not reach health endpoint",
          },
        });
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 text-xs ${collapsed ? "justify-center" : ""}`}>
        <Database className="h-3 w-3 animate-pulse text-muted" />
        {!collapsed && <span className="text-muted">Checking...</span>}
      </div>
    );
  }

  if (!health) return null;

  const isHealthy = health.status === "healthy";
  const isConfigured = health.database.configured;

  const statusColor = isHealthy
    ? "text-success"
    : isConfigured
      ? "text-danger"
      : "text-muted";

  const StatusIcon = isHealthy
    ? CheckCircle
    : isConfigured
      ? XCircle
      : AlertCircle;

  const statusText = isHealthy
    ? "Connected"
    : isConfigured
      ? "Not connected"
      : "Not configured";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${collapsed ? "justify-center" : ""}`}
      title={health.database.error ?? statusText}
    >
      <div className="relative flex h-3 w-3 shrink-0 items-center justify-center">
        <Database className="h-3 w-3 text-muted" />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card ${isHealthy ? "bg-success" : isConfigured ? "bg-danger" : "bg-muted"}`}
        />
      </div>
      {!collapsed && (
        <span className={statusColor}>{statusText}</span>
      )}
    </div>
  );
}
