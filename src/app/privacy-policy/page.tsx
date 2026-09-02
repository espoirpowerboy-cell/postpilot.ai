import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PostPilot AI",
  description: "Privacy Policy for PostPilot AI — how we collect, use, and protect your data.",
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

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Table of contents */}
        <nav className="mb-12 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <TocItem href="#introduction">1. Introduction</TocItem>
            <TocItem href="#data-collected">2. Data We Collect</TocItem>
            <TocItem href="#data-use">3. How We Use Your Data</TocItem>
            <TocItem href="#tiktok-data">4. TikTok Integration and Data</TocItem>
            <TocItem href="#third-party">5. Third-Party Services</TocItem>
            <TocItem href="#cookies">6. Cookies and Local Storage</TocItem>
            <TocItem href="#data-sharing">7. Data Sharing</TocItem>
            <TocItem href="#data-retention">8. Data Retention</TocItem>
            <TocItem href="#security">9. Data Security</TocItem>
            <TocItem href="#user-rights">10. Your Rights</TocItem>
            <TocItem href="#account-deletion">11. Account Deletion</TocItem>
            <TocItem href="#children">12. Children&apos;s Privacy</TocItem>
            <TocItem href="#changes">13. Changes to This Policy</TocItem>
            <TocItem href="#contact">14. Contact Us</TocItem>
          </ul>
        </nav>

        {/* Sections */}
        <Section id="introduction" title="1. Introduction">
          <p>
            PostPilot AI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an AI-powered workspace for managing TikTok content. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services (collectively, the &quot;Service&quot;).
          </p>
          <p>
            By using PostPilot AI, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the Service.
          </p>
        </Section>

        <Section id="data-collected" title="2. Data We Collect">
          <h3 className="text-base font-semibold text-foreground mb-2">2.1 Account Information</h3>
          <p>
            When you create an account, we collect information you provide directly:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Email address</li>
            <li>Name (if provided)</li>
            <li>Password (stored securely via Supabase Auth — we never see or store plaintext passwords)</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-2 mt-6">2.2 TikTok Account Data</h3>
          <p>
            When you connect your TikTok account through our official OAuth integration, we access data authorized by you through TikTok&apos;s official APIs. This may include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Profile information: username, display name, avatar URL, bio, verification status</li>
            <li>Account statistics: follower count, following count, total likes, video count</li>
            <li>Video data: video titles, thumbnails, view counts, engagement metrics</li>
            <li>Comment data: comments on your videos and your ability to respond</li>
          </ul>
          <p>
            This data is accessed only through TikTok&apos;s official Content Posting API and Login Kit. We do not scrape, crawl, or otherwise access TikTok data outside of their official APIs.
          </p>

          <h3 className="text-base font-semibold text-foreground mb-2 mt-6">2.3 Content and Usage Data</h3>
          <p>
            While using the Service, we store data you create or interact with:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Posts you create, schedule, or publish through PostPilot AI</li>
            <li>Comments you classify, reply to, or manage</li>
            <li>Automation rules and configurations you set up</li>
            <li>Client information you add to manage multiple accounts</li>
            <li>Analytics data derived from your TikTok activity</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-2 mt-6">2.4 Technical Data</h3>
          <p>
            We automatically collect certain technical information:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>IP address and approximate location</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage logs and error reports</li>
          </ul>
        </Section>

        <Section id="data-use" title="3. How We Use Your Data">
          <p>We use your data to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide, operate, and maintain the Service</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Sync your TikTok content, analytics, and interactions</li>
            <li>Provide AI-powered comment classification and response suggestions</li>
            <li>Schedule and manage your content publishing</li>
            <li>Execute automation rules you have configured</li>
            <li>Generate analytics and insights about your TikTok performance</li>
            <li>Send transactional emails (account confirmation, password resets)</li>
            <li>Improve and develop new features</li>
            <li>Detect and prevent fraud, abuse, and security issues</li>
          </ul>
        </Section>

        <Section id="tiktok-data" title="4. TikTok Integration and Data">
          <p>
            PostPilot AI integrates with TikTok through their official developer platform. Here is what you should know:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>We use TikTok OAuth for authentication — you authorize the connection directly with TikTok</li>
            <li>We only request the permissions (scopes) necessary for the features you use</li>
            <li>Access tokens are stored securely on our servers and are never exposed to your browser</li>
            <li>We refresh tokens automatically to maintain your connection</li>
            <li>You can revoke our access at any time from the TikTok Developer Portal or by disconnecting in PostPilot AI</li>
            <li>TikTok data is used exclusively to provide the features you authorized</li>
          </ul>
          <p>
            We are compliant with TikTok&apos;s Developer Terms and API usage policies. We do not sell, share, or use TikTok data for purposes other than providing the Service to you.
          </p>
        </Section>

        <Section id="third-party" title="5. Third-Party Services">
          <p>PostPilot AI relies on the following third-party services:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Supabase</strong> — Authentication and database hosting. Supabase handles user authentication, session management, and PostgreSQL database hosting. Refer to Supabase&apos;s privacy policy for details on how they process data.</li>
            <li><strong>TikTok for Developers</strong> — Social platform integration. We use TikTok&apos;s official APIs for OAuth, content management, and analytics. Refer to TikTok&apos;s privacy policy for details.</li>
            <li><strong>Vercel</strong> — Application hosting and deployment.</li>
          </ul>
          <p>
            Each third-party service has its own privacy policy. We encourage you to review them. We only share the minimum data necessary for these services to function.
          </p>
        </Section>

        <Section id="cookies" title="6. Cookies and Local Storage">
          <p>We use the following cookies and local storage:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Authentication cookies</strong> — Set by Supabase Auth to maintain your login session. These are essential for the Service to function.</li>
            <li><strong>OAuth state cookies</strong> — Temporary cookies used during TikTok OAuth to prevent CSRF attacks. These are deleted immediately after the OAuth flow completes.</li>
            <li><strong>Theme preference</strong> — Your light/dark mode preference is stored in your browser&apos;s localStorage. This contains no personal data.</li>
          </ul>
          <p>
            We do not use advertising cookies or third-party tracking cookies.
          </p>
        </Section>

        <Section id="data-sharing" title="7. Data Sharing">
          <p>
            We do <strong>not</strong> sell, trade, or rent your personal data to third parties. We may share your data only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>With your consent</strong> — When you explicitly authorize a data sharing action</li>
            <li><strong>TikTok API calls</strong> — When you publish or interact with content, data is sent to TikTok through their official APIs as part of the Service</li>
            <li><strong>Service providers</strong> — Our infrastructure providers (Supabase, Vercel) process data on our behalf under strict data processing agreements</li>
            <li><strong>Legal requirements</strong> — If required by law, regulation, or valid legal process</li>
            <li><strong>Security</strong> — To protect the rights, property, or safety of PostPilot AI, our users, or the public</li>
          </ul>
        </Section>

        <Section id="data-retention" title="8. Data Retention">
          <p>
            We retain your data for as long as your account is active or as needed to provide the Service. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Account data</strong> — Retained while your account exists</li>
            <li><strong>TikTok tokens</strong> — Retained while your TikTok connection is active; deleted when you disconnect</li>
            <li><strong>Content and analytics</strong> — Retained according to your subscription plan (7 days for Free, up to 90+ days for paid plans)</li>
            <li><strong>Authentication logs</strong> — Retained for security purposes for up to 90 days</li>
          </ul>
          <p>
            When you delete your account, we delete or anonymize your personal data within 30 days, except where we are legally required to retain certain records.
          </p>
        </Section>

        <Section id="security" title="9. Data Security">
          <p>
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All data is encrypted in transit (TLS/SSL)</li>
            <li>Passwords are handled by Supabase Auth using industry-standard hashing (bcrypt) — we never see or store plaintext passwords</li>
            <li>API tokens and secrets are stored encrypted in our database and are never exposed to the client</li>
            <li>Access to production data is restricted to authorized personnel only</li>
            <li>We use CSRF protection for all OAuth flows</li>
          </ul>
          <p>
            While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </Section>

        <Section id="user-rights" title="10. Your Rights">
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Access</strong> — Request a copy of the personal data we hold about you</li>
            <li><strong>Correction</strong> — Request correction of inaccurate data</li>
            <li><strong>Deletion</strong> — Request deletion of your personal data</li>
            <li><strong>Portability</strong> — Request your data in a machine-readable format</li>
            <li><strong>Objection</strong> — Object to processing of your data</li>
            <li><strong>Restriction</strong> — Request restriction of processing</li>
            <li><strong>Withdraw consent</strong> — Where processing is based on consent, withdraw it at any time</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the email address below. We will respond to your request within 30 days.
          </p>
        </Section>

        <Section id="account-deletion" title="11. Account Deletion">
          <p>
            You may delete your account at any time from the Settings page. Upon deletion:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Your Supabase Auth account is deleted</li>
            <li>All your Prisma data (posts, comments, automations, clients, notifications) is deleted</li>
            <li>Your TikTok connection is revoked</li>
            <li>Your subscription is canceled</li>
            <li>Analytics data associated with your account is anonymized within 30 days</li>
          </ul>
          <p>
            This action is irreversible. Please ensure you have exported any data you wish to keep before deleting your account.
          </p>
        </Section>

        <Section id="children" title="12. Children&apos;s Privacy">
          <p>
            PostPilot AI is not intended for use by children under the age of 16. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us so we can delete it.
          </p>
        </Section>

        <Section id="changes" title="13. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section id="contact" title="14. Contact Us">
          <p>
            If you have questions about this Privacy Policy or wish to exercise your data rights, contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@postpilot.ai
          </p>
          <p>
            We will respond to all inquiries within 30 days.
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
