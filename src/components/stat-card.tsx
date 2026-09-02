import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export default function StatCard({ label, value, change, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-1">
        {trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-danger" />
        )}
        <span className={`text-sm font-medium ${trend === "up" ? "text-success" : "text-danger"}`}>
          {change}
        </span>
        <span className="text-sm text-muted">vs last month</span>
      </div>
    </div>
  );
}
