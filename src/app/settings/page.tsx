"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { useTheme } from "@/components/theme-provider";
import {
  User,
  Bell,
  CreditCard,
  Palette,
  Shield,
  Key,
  Moon,
  Sun,
  Mail,
  Globe,
  Save,
  Camera,
  Check,
} from "lucide-react";

type SettingsTab = "profile" | "notifications" | "billing" | "appearance" | "security";

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
  { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
];

function ProfileSettings() {
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 text-accent text-2xl font-bold">
            AJ
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-sm hover:bg-accent-hover transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h3 className="text-base font-semibold">Alex Johnson</h3>
          <p className="text-sm text-muted">alex@postpilot.ai</p>
          <button className="mt-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors">
            Change avatar
          </button>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1.5">First name</label>
          <input
            type="text"
            defaultValue="Alex"
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Last name</label>
          <input
            type="text"
            defaultValue="Johnson"
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            defaultValue="alex@postpilot.ai"
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Timezone</label>
          <select className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Eastern Time (UTC-5)</option>
            <option>Central Time (UTC-6)</option>
            <option>Pacific Time (UTC-8)</option>
            <option>UTC</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Bio</label>
        <textarea
          defaultValue="Content creator and social media strategist. I help brands grow on TikTok."
          rows={3}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Website</label>
        <input
          type="url"
          defaultValue="https://alexjohnson.com"
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    postPublished: true,
    newComment: true,
    commentReply: false,
    weeklyReport: true,
    automationAlerts: true,
    mentionAlerts: true,
    emailDigest: false,
    pushNotifications: true,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        enabled ? "bg-accent" : "bg-border"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  const items = [
    { key: "postPublished" as const, label: "Post published", description: "Get notified when a scheduled post goes live" },
    { key: "newComment" as const, label: "New comment", description: "Receive alerts for new comments on your posts" },
    { key: "commentReply" as const, label: "Comment reply", description: "Get notified when someone replies to a comment" },
    { key: "weeklyReport" as const, label: "Weekly report", description: "Receive a weekly performance summary" },
    { key: "automationAlerts" as const, label: "Automation alerts", description: "Get notified when automations need attention" },
    { key: "mentionAlerts" as const, label: "Mention alerts", description: "Get notified when your brand is mentioned" },
    { key: "emailDigest" as const, label: "Email digest", description: "Receive a daily email digest of activity" },
    { key: "pushNotifications" as const, label: "Push notifications", description: "Enable browser push notifications" },
  ];

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between py-4 border-b border-border last:border-0">
          <div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted mt-0.5">{item.description}</p>
          </div>
          <ToggleSwitch enabled={notifications[item.key]} onToggle={() => toggle(item.key)} />
        </div>
      ))}
      <div className="flex justify-end pt-4">
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Pro Plan</h3>
            <p className="text-sm text-muted">$49/month • Billed monthly</p>
          </div>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">Current Plan</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted">Posts/month</p>
            <p className="font-semibold">Unlimited</p>
          </div>
          <div>
            <p className="text-muted">AI Assistant</p>
            <p className="font-semibold">500 uses</p>
          </div>
          <div>
            <p className="text-muted">Clients</p>
            <p className="font-semibold">10</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
            Upgrade Plan
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-sidebar-hover transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {/* Payment method */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-hover">
            <CreditCard className="h-5 w-5 text-muted" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Visa ending in 4242</p>
            <p className="text-xs text-muted">Expires 12/2027</p>
          </div>
          <button className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            Update
          </button>
        </div>
      </div>

      {/* Billing history */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Billing History</h3>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-sidebar-hover/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Description</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "Aug 1, 2026", desc: "Pro Plan - Monthly", amount: "$49.00", status: "Paid" },
                { date: "Jul 1, 2026", desc: "Pro Plan - Monthly", amount: "$49.00", status: "Paid" },
                { date: "Jun 1, 2026", desc: "Pro Plan - Monthly", amount: "$49.00", status: "Paid" },
              ].map((item, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 text-sm">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-muted">{item.desc}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{item.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      <Check className="h-3 w-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-4">Theme</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={theme === "dark" ? toggleTheme : undefined}
            className={`rounded-xl border-2 p-4 text-center transition-all ${
              theme === "light" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
            }`}
          >
            <Sun className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-medium">Light</p>
            {theme === "light" && (
              <div className="mt-2 flex justify-center">
                <span className="rounded-full bg-accent p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </span>
              </div>
            )}
          </button>
          <button
            onClick={theme === "light" ? toggleTheme : undefined}
            className={`rounded-xl border-2 p-4 text-center transition-all ${
              theme === "dark" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
            }`}
          >
            <Moon className="h-8 w-8 mx-auto mb-2 text-indigo-400" />
            <p className="text-sm font-medium">Dark</p>
            {theme === "dark" && (
              <div className="mt-2 flex justify-center">
                <span className="rounded-full bg-accent p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Sidebar</h3>
        <p className="text-sm text-muted mb-3">Customize the sidebar behavior.</p>
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium">Compact mode</p>
              <p className="text-xs text-muted">Show icons only in the sidebar</p>
            </div>
            <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-border transition-colors">
              <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm translate-x-0 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">Show search bar</p>
              <p className="text-xs text-muted">Display the search bar at the top of the sidebar</p>
            </div>
            <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-accent transition-colors">
              <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm translate-x-5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* Password */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1.5">Current password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">New password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
            <Key className="h-4 w-4" />
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Two-Factor Authentication</h3>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Authenticator app</p>
            <p className="text-xs text-muted mt-0.5">Use an authenticator app to generate one-time codes</p>
          </div>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-sidebar-hover transition-colors">
            Enable
          </button>
        </div>
      </div>

      {/* Sessions */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Chrome on macOS</p>
              <p className="text-xs text-muted mt-0.5">New York, US • Last active: Now</p>
            </div>
            <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">Current</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Safari on iPhone</p>
              <p className="text-xs text-muted mt-0.5">New York, US • Last active: 2 hours ago</p>
            </div>
            <button className="text-xs font-medium text-danger hover:text-danger/80 transition-colors">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Manage your account preferences and configurations."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
        {/* Tab navigation */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-sidebar-hover hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="rounded-xl border border-border bg-card p-6">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "billing" && <BillingSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </DashboardLayout>
  );
}
