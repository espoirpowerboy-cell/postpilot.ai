"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  Sparkles,
  Zap,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  Link2,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import DatabaseStatus from "@/components/database-status";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/language-context";

function useNavItems() {
  const { t } = useLanguage();
  return [
    { label: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("nav.calendar"), href: "/calendar", icon: Calendar },
    { label: t("nav.posts"), href: "/posts", icon: FileText },
    { label: t("nav.comments"), href: "/comments", icon: MessageSquare },
    { label: t("nav.aiAssistant"), href: "/ai-assistant", icon: Sparkles },
    { label: t("nav.automations"), href: "/automations", icon: Zap },
    { label: t("nav.analytics"), href: "/analytics", icon: BarChart3 },
    { label: t("nav.clients"), href: "/clients", icon: Users },
  ];
}

function useBottomItems() {
  const { t } = useLanguage();
  return [
    { label: t("nav.connect"), href: "/connect", icon: Link2 },
    { label: t("nav.settings"), href: "/settings", icon: Settings },
  ];
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const navItems = useNavItems();
  const bottomItems = useBottomItems();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [user, setUser] = useState<{ name: string | null; email: string | null } | null>(null);

  // Fetch user from Supabase session
  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        setUser({
          name: (supabaseUser.user_metadata?.name as string) ?? null,
          email: supabaseUser.email ?? null,
        });
      }
    }

    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: (session.user.user_metadata?.name as string) ?? null,
          email: session.user.email ?? null,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/notifications?count=true");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch {
        // Keep default
      }
    }
    fetchCount();
  }, []);

  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";
  const initials = getInitials(user?.name, user?.email);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-card p-2 shadow-md border border-border lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-sidebar-bg border-r border-border flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-border px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">
            PP
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">
              PostPilot
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hidden lg:flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 rounded-lg bg-sidebar-hover px-3 py-2 text-sm text-muted">
              <Search className="h-4 w-4 shrink-0" />
              <span>Search...</span>
              <span className="ml-auto text-xs rounded bg-sidebar-active px-1.5 py-0.5">⌘K</span>
            </div>
          </div>
        )}

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                      ${isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:text-foreground hover:bg-sidebar-hover"
                      }
                      ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-3 border-t border-border" />

          <ul className="space-y-0.5">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                      ${isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:text-foreground hover:bg-sidebar-hover"
                      }
                      ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border px-3 py-3 space-y-2">
          {!collapsed && <LanguageSwitcher />}
          <DatabaseStatus collapsed={collapsed} />
          <button
            onClick={toggleTheme}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors
              ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? (theme === "dark" ? "Light mode" : "Dark mode") : undefined}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {!collapsed && <span>{theme === "dark" ? (language === "fr" ? "Mode clair" : "Light Mode") : (language === "fr" ? "Mode sombre" : "Dark Mode")}</span>}
          </button>

          <button
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors
              ${collapsed ? "justify-center" : ""}`}
          >
            <Bell className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Notifications</span>
                {unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </>
            )}
          </button>

          {/* User avatar — real session data */}
          <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-bold">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted truncate">{userEmail}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleSignOut}
                className="text-muted hover:text-danger transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
