import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PostPilot AI",
  description: "Terms of Service for PostPilot AI — the rules governing use of our platform.",
};

const LAST_UPDATED = "September 2, 2026";

function TocItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="text-sm text-muted hover:text-foreground transition-colors">
        {children}
      </a>
    </li>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4 text-sm text-muted leading-relaxed">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">
              PP
            </div>
            <span className="text-lg font-bold tracking-tight">PostPilot AI</span>
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm text-muted">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Table of contents */}
        <nav className="mb-12 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <TocItem href="#acceptance">1. Acceptance of Terms</TocItem>
            <TocItem href="#description">2. Description of Service</TocItem>
            <TocItem href="#account">3. Account Registration</TocItem>
            <TocItem href="#tiktok-connection">4. TikTok Connection</TocItem>
            <TocItem href="#user-responsibilities">5. User Responsibilities</TocItem>
            <TocItem href="#ai-features">6. AI Features</TocItem>
            <TocItem href="#automations">7. Automations</TocItem>
            <TocItem href="#subscriptions">8. Subscriptions and Billing</TocItem>
            <TocItem href="#intellectual-property">9. Intellectual Property</TocItem>
            <TocItem href="#user-content">10. User Content</TocItem>
            <TocItem href="#prohibited-use">11. Prohibited Uses</TocItem>
            <TocItem href="#third-party">12. Third-Party Services</TocItem>
            <TocItem href="#availability">13. Service Availability</TocItem>
            <TocItem href="#limitation">14. Limitation of Liability</TocItem>
            <TocItem href="#indemnification">15. Indemnification</TocItem>
            <TocItem href="#termination">16. Termination</TocItem>
            <TocItem href="#disputes">17. Disputes</TocItem>
            <TocItem href="#changes-tos">18. Changes to Terms</TocItem>
            <TocItem href="#contact-tos">19. Contact Us</TocItem>
          </ul>
        </nav>

        {/* Sections */}
        <Section id="acceptance" title="1. Acceptance of Terms">
          <p>
            By accessing or using PostPilot AI (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service.
          </p>
          <p>
            You represent that you are at least 16 years of age and have the legal capacity to enter into these Terms.
          </p>
        </Section>

        <Section id="description" title="2. Description of Service">
          <p>
            PostPilot AI is an AI-powered workspace for managing your TikTok presence. The Service provides:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Content scheduling and publishing through TikTok&apos;s official APIs</li>
            <li>AI-powered comment classification and response suggestions</li>
            <li>Automation rules for repetitive tasks</li>
            <li>Analytics and performance tracking</li>
            <li>Multi-account and multi-client management</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
          </p>
        </Section>

        <Section id="account" title="3. Account Registration">
          <p>
            To use PostPilot AI, you must create an account. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Maintain the security of your password and account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
          <p>
            We are not liable for any loss or damage arising from your failure to maintain account security.
          </p>
        </Section>

        <Section id="tiktok-connection" title="4. TikTok Connection">
          <p>
            PostPilot AI connects to TikTok through their official OAuth protocol. By connecting your TikTok account:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You authorize PostPilot AI to access your TikTok account within the permissions you approve</li>
            <li>You understand that PostPilot AI will perform actions on your behalf as permitted (e.g., publishing content, responding to comments)</li>
            <li>You remain responsible for all content published and actions taken through PostPilot AI on your TikTok account</li>
            <li>You can revoke PostPilot AI&apos;s access at any time by disconnecting in the app or via TikTok&apos;s settings</li>
          </ul>
          <p>
            PostPilot AI is not affiliated with or endorsed by TikTok. Your use of TikTok is subject to TikTok&apos;s own Terms of Service.
          </p>
        </Section>

        <Section id="user-responsibilities" title="5. User Responsibilities">
          <p>You are responsible for:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All content you create, schedule, or publish through PostPilot AI</li>
            <li>Compliance with TikTok&apos;s Terms of Service and Community Guidelines</li>
            <li>Compliance with all applicable laws and regulations</li>
            <li>The accuracy and appropriateness of automation rules you configure</li>
            <li>Reviewing AI-generated suggestions before using them</li>
            <li>Obtaining necessary rights and permissions for content you publish</li>
          </ul>
        </Section>

        <Section id="ai-features" title="6. AI Features">
          <p>
            PostPilot AI includes artificial intelligence features such as comment classification and response suggestions. You acknowledge:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>AI-generated content is provided as suggestions only and should be reviewed before use</li>
            <li>We do not guarantee the accuracy, completeness, or appropriateness of AI outputs</li>
            <li>You are solely responsible for any content published using AI suggestions</li>
            <li>AI features may not be available at all times and may be updated or modified</li>
            <li>We may use aggregated and anonymized data to improve AI features</li>
          </ul>
        </Section>

        <Section id="automations" title="7. Automations">
          <p>
            PostPilot AI allows you to create automation rules that perform actions based on triggers. You acknowledge:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You are responsible for the configuration and consequences of your automation rules</li>
            <li>Automations operate within the limits of the TikTok API and PostPilot AI</li>
            <li>We are not responsible for unintended actions resulting from misconfigured automations</li>
            <li>We may rate-limit or disable automations that violate TikTok&apos;s policies or cause excessive API usage</li>
          </ul>
        </Section>

        <Section id="subscriptions" title="8. Subscriptions and Billing">
          <p>
            PostPilot AI offers free and paid subscription plans. By selecting a paid plan:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You authorize us to charge the applicable subscription fees to your payment method</li>
            <li>Subscriptions automatically renew unless canceled before the current period ends</li>
            <li>You may upgrade or downgrade your plan at any time; changes take effect at the next billing cycle</li>
            <li>Refund requests are handled on a case-by-case basis within 14 days of purchase</li>
          </ul>
          <p>
            Payment processing is handled by a third-party payment processor. We do not store your payment card details on our servers.
          </p>
          <p>
            Free plan users have access to limited features as described in the pricing section of the Service. Free plans may be modified or discontinued at any time.
          </p>
        </Section>

        <Section id="intellectual-property" title="9. Intellectual Property">
          <p>
            The Service, including its software, design, branding, and documentation, is owned by PostPilot AI and protected by intellectual property laws. You may not:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Copy, modify, or distribute any part of the Service</li>
            <li>Reverse engineer, decompile, or attempt to extract the source code</li>
            <li>Use our branding, logos, or trademarks without written permission</li>
            <li>Remove or alter any proprietary notices on the Service</li>
          </ul>
          <p>
            Subject to your subscription, we grant you a limited, non-exclusive, non-transferable license to use the Service for its intended purpose.
          </p>
        </Section>

        <Section id="user-content" title="10. User Content">
          <p>
            You retain ownership of all content you create and publish through PostPilot AI. By using the Service, you grant us a limited license to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Process and display your content within the Service</li>
            <li>Transmit your content to TikTok on your behalf when you choose to publish</li>
            <li>Store your content to provide the Service features (scheduling, analytics, etc.)</li>
          </ul>
          <p>
            This license terminates when you delete your content or your account, except where we are required to retain data for legal or operational purposes.
          </p>
        </Section>

        <Section id="prohibited-use" title="11. Prohibited Uses">
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Violate TikTok&apos;s Terms of Service or Community Guidelines</li>
            <li>Publish spam, misleading, or deceptive content</li>
            <li>Impersonate another person or entity</li>
            <li>Distribute malware, phishing content, or other harmful material</li>
            <li>Attempt to gain unauthorized access to the Service or other users&apos; accounts</li>
            <li>Abuse the API or automation features to overload the system</li>
            <li>Use the Service for any unlawful purpose</li>
            <li>Scrape, mine, or harvest data from the Service</li>
          </ul>
        </Section>

        <Section id="third-party" title="12. Third-Party Services">
          <p>
            PostPilot AI integrates with third-party services including TikTok, Supabase, and Vercel. Your use of these third-party services is subject to their respective terms. We are not responsible for the availability, accuracy, or practices of third-party services.
          </p>
        </Section>

        <Section id="availability" title="13. Service Availability">
          <p>
            We strive to maintain high availability but do not guarantee uninterrupted service. We may experience downtime for maintenance, updates, or unforeseen issues. We will make reasonable efforts to notify you of planned maintenance.
          </p>
        </Section>

        <Section id="limitation" title="14. Limitation of Liability">
          <p>
            To the maximum extent permitted by law:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind</li>
            <li>We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement</li>
            <li>PostPilot AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim</li>
          </ul>
        </Section>

        <Section id="indemnification" title="15. Indemnification">
          <p>
            You agree to indemnify and hold harmless PostPilot AI, its officers, directors, employees, and agents from any claims, losses, or damages arising from:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights, including intellectual property and privacy rights</li>
            <li>Content you publish through the Service</li>
          </ul>
        </Section>

        <Section id="termination" title="16. Termination">
          <p>
            You may terminate your account at any time through the Settings page or by contacting us. We may suspend or terminate your access to the Service if:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You violate these Terms</li>
            <li>You engage in prohibited use</li>
            <li>We are required to do so by law</li>
            <li>We discontinue the Service with reasonable notice</li>
          </ul>
          <p>
            Upon termination, your right to use the Service ceases immediately. We will handle your data as described in our Privacy Policy.
          </p>
        </Section>

        <Section id="disputes" title="17. Disputes">
          <p>
            These Terms are governed by the laws of the European Union and applicable member state laws. Any disputes arising from these Terms or the Service shall be resolved through good-faith negotiation first. If unresolved, disputes shall be submitted to the competent courts of the applicable jurisdiction.
          </p>
        </Section>

        <Section id="changes-tos" title="18. Changes to Terms">
          <p>
            We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section id="contact-tos" title="19. Contact Us">
          <p>
            If you have questions about these Terms of Service, contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@postpilot.ai
          </p>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white font-bold text-xs">
                PP
              </div>
              <span className="text-sm font-semibold">PostPilot AI</span>
            </Link>
            <div className="flex items-center gap-4 text-xs text-muted">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
