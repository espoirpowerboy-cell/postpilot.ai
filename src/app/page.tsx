import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Zap,
  BarChart3,
  Users,
  Link2,
  Check,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  MessageSquare,
  Bot,
  Clock,
  TrendingUp,
  Star,
} from "lucide-react";

// ─── Navbar ──────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">
            PP
          </div>
          <span className="text-lg font-bold tracking-tight">PostPilot AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-muted hover:text-foreground transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-muted hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium text-accent">AI-powered TikTok management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Your AI assistant{" "}
            <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
              for TikTok
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Plan, automate and grow your TikTok presence with one intelligent workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:shadow-xl transition-all"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-sidebar-hover transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Product preview */}
        <div className="mt-16 relative">
          <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-accent/5">
            <div className="rounded-xl bg-sidebar-bg p-6">
              {/* Mock dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold">Dashboard</h3>
                  <p className="text-xs text-muted">Welcome back, Alex</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs text-muted">TikTok connected</span>
                </div>
              </div>

              {/* Mock stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Posts", value: "1,247", change: "+12.5%" },
                  { label: "Total Views", value: "3.2M", change: "+18.2%" },
                  { label: "Engagement", value: "4.8%", change: "+0.3%" },
                  { label: "Followers", value: "57.8K", change: "+7.1%" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
                    <p className="text-[10px] text-muted">{stat.label}</p>
                    <p className="text-sm font-bold">{stat.value}</p>
                    <p className="text-[10px] text-success">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Mock content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Calendar mock */}
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[10px] font-medium">Upcoming Posts</span>
                  </div>
                  <div className="space-y-2">
                    {["Behind the Scenes Reel", "Q&A Response", "Trend Challenge"].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 rounded bg-sidebar-hover px-2 py-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span className="text-[10px] truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments mock */}
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[10px] font-medium">Recent Comments</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { author: "@sarah_designs", sentiment: "positive" },
                      { author: "@techguru_mike", sentiment: "neutral" },
                      { author: "@creative_luna", sentiment: "positive" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-2 rounded bg-sidebar-hover px-2 py-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${c.sentiment === "positive" ? "bg-success" : "bg-muted"}`} />
                        <span className="text-[10px] truncate">{c.author}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automations mock */}
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[10px] font-medium">Active Automations</span>
                  </div>
                  <div className="space-y-2">
                    {["Auto-Reply Positive", "Welcome Followers", "Post Reminder"].map((a, i) => (
                      <div key={i} className="flex items-center justify-between rounded bg-sidebar-hover px-2 py-1.5">
                        <span className="text-[10px] truncate">{a}</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-success" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-b from-accent/10 to-transparent rounded-3xl -z-10 blur-xl" />
        </div>
      </div>
    </section>
  );
}

// ─── Trust Banner ────────────────────────────────────────────

function TrustBanner() {
  return (
    <section className="py-16 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-muted uppercase tracking-wider">
          Everything you need to manage TikTok smarter
        </p>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────

const features = [
  {
    icon: Bot,
    title: "AI Comment Assistant",
    description: "Let AI help classify and respond to comments while keeping you in control.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Plan your content and keep your publishing workflow organized.",
  },
  {
    icon: Zap,
    title: "Automation Rules",
    description: "Create simple rules that automate repetitive tasks.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Understand what is working and make better content decisions.",
  },
  {
    icon: Users,
    title: "Multi-client Management",
    description: "Manage multiple brands and clients from one workspace.",
  },
  {
    icon: Link2,
    title: "TikTok Integration",
    description: "Connect your TikTok account securely through the official TikTok APIs.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Built for TikTok creators
          </h2>
          <p className="text-lg text-muted">
            Everything you need to manage your TikTok presence, powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Connect your TikTok account securely.",
    icon: Link2,
  },
  {
    number: "02",
    title: "Configure",
    description: "Set your schedule, automation rules and AI preferences.",
    icon: Settings,
  },
  {
    number: "03",
    title: "Grow",
    description: "Manage your content and understand your performance from one workspace.",
    icon: TrendingUp,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-sidebar-bg/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted">
            Get started in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-6">
                <step.icon className="h-6 w-6 text-accent" />
              </div>
              <div className="text-xs font-bold text-accent mb-2">Step {step.number}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Showcase ────────────────────────────────────────

function ProductShowcase() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            One workspace for everything
          </h2>
          <p className="text-lg text-muted">
            From scheduling to analytics, manage your entire TikTok workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Dashboard card */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <BarChart3 className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-sm font-semibold">Dashboard</h3>
            </div>
            <div className="rounded-lg bg-sidebar-bg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {["1,247 Posts", "3.2M Views", "4.8% Engagement", "57.8K Followers"].map((s) => (
                  <div key={s} className="rounded bg-card border border-border p-2">
                    <p className="text-[10px] font-medium">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar card */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-sm font-semibold">Content Calendar</h3>
            </div>
            <div className="rounded-lg bg-sidebar-bg p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="text-center text-[8px] text-muted py-1">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded text-center flex items-center justify-center text-[8px] ${
                      [3, 7, 12, 18, 24].includes(i)
                        ? "bg-accent/20 text-accent font-medium"
                        : "text-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments card */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <MessageSquare className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-sm font-semibold">Comments Inbox</h3>
            </div>
            <div className="rounded-lg bg-sidebar-bg p-4 space-y-2">
              {[
                { author: "@sarah_designs", text: "This is exactly what I needed!", sentiment: "positive" },
                { author: "@techguru_mike", text: "Great video but tip #5...", sentiment: "neutral" },
                { author: "@creative_luna", text: "Love your content! 🎬", sentiment: "positive" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-card border border-border p-2">
                  <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.sentiment === "positive" ? "bg-success" : "bg-muted"}`} />
                  <span className="text-[10px] font-medium shrink-0">{c.author}</span>
                  <span className="text-[10px] text-muted truncate">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics card */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-sm font-semibold">Analytics</h3>
            </div>
            <div className="rounded-lg bg-sidebar-bg p-4">
              <div className="flex items-end gap-1 h-20">
                {[40, 55, 35, 70, 45, 85, 60, 75, 50, 90, 65, 80].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-accent/30 hover:bg-accent/50 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[8px] text-muted">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "/month",
    description: "Perfect for getting started",
    features: ["1 TikTok account", "Basic scheduling", "AI comment assistant", "7-day analytics"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Creator",
    price: "€9.99",
    period: "/month",
    description: "For individual creators",
    features: ["1 TikTok account", "Advanced scheduling", "AI comment assistant", "30-day analytics", "Automation rules"],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "€24.99",
    period: "/month",
    description: "For growing creators",
    features: ["3 TikTok accounts", "Smart scheduling", "AI comment assistant", "90-day analytics", "Unlimited automations", "Priority support"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "€59.99",
    period: "/month",
    description: "For teams and agencies",
    features: ["10 TikTok accounts", "Team collaboration", "AI comment assistant", "Full analytics", "Unlimited automations", "Dedicated support", "Custom integrations"],
    cta: "Contact sales",
    highlighted: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-sidebar-bg/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted">
            Start for free, upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-accent bg-card shadow-lg shadow-accent/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                    <Star className="h-3 w-3" /> Most popular
                  </span>
                </div>
              )}
              <h3 className="text-sm font-semibold mb-1">{plan.name}</h3>
              <p className="text-xs text-muted mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "border border-border hover:bg-sidebar-hover"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Final ───────────────────────────────────────────────

function CtaFinal() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border bg-card p-12 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to work smarter on TikTok?
            </h2>
            <p className="text-lg text-muted max-w-xl mx-auto mb-8">
              Start building a better TikTok workflow with PostPilot AI.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:shadow-xl transition-all"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────

const faqs = [
  {
    question: "What is PostPilot AI?",
    answer: "PostPilot AI is an AI-powered workspace for managing your TikTok presence. It helps you schedule content, respond to comments, automate tasks, and track your performance — all from one dashboard.",
  },
  {
    question: "Can I connect my TikTok account?",
    answer: "Yes. PostPilot AI connects to TikTok through the official TikTok OAuth flow. You authorize the connection directly with TikTok — we never store your TikTok password.",
  },
  {
    question: "Does PostPilot AI use the official TikTok API?",
    answer: "Yes. We use TikTok's official Content Posting API and Login Kit for all integrations. No scraping, no unofficial methods, no workarounds.",
  },
  {
    question: "Can I automate comment responses?",
    answer: "Yes. You can create automation rules that classify comments by sentiment and generate AI-powered response suggestions. You always review and approve before anything is posted.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. The Free plan includes 1 TikTok account, basic scheduling, AI comment assistant, and 7-day analytics. No credit card required to start.",
  },
];

function Faq() {
  return (
    <section id="faq" className="py-24 bg-sidebar-bg/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-xl border border-border bg-card">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="text-sm font-semibold pr-4">{faq.question}</span>
                <ChevronDown className="h-4 w-4 text-muted shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white font-bold text-xs">
              PP
            </div>
            <span className="text-sm font-semibold">PostPilot AI</span>
          </div>

          <p className="text-xs text-muted text-center md:text-left max-w-sm">
            Your AI assistant for TikTok. Plan, automate and grow your presence.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-muted hover:text-foreground transition-colors">Login</Link>
            <Link href="/register" className="text-xs text-muted hover:text-foreground transition-colors">Register</Link>
            <a href="#" className="text-xs text-muted hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} PostPilot AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Settings icon (missing import) ──────────────────────────

function Settings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustBanner />
        <Features />
        <HowItWorks />
        <ProductShowcase />
        <Pricing />
        <CtaFinal />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
