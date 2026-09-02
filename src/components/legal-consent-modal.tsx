"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function LegalConsentModal() {
  const [visible, setVisible] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if consent is needed on mount
  useEffect(() => {
    async function checkConsent() {
      try {
        const res = await fetch("/api/legal/consent");
        if (res.ok) {
          const data = await res.json();
          // Show modal only if either consent is missing
          if (!data.acceptedPrivacyPolicy || !data.acceptedTerms) {
            setVisible(true);
          }
        }
      } catch {
        // If the check fails, don't block the user
      } finally {
        setChecking(false);
      }
    }
    checkConsent();
  }, []);

  async function handleAccept() {
    if (!privacyChecked || !termsChecked) return;

    setLoading(true);
    try {
      const res = await fetch("/api/legal/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acceptedPrivacyPolicy: true,
          acceptedTerms: true,
        }),
      });

      if (res.ok) {
        setVisible(false);
      }
    } catch {
      // Don't block user on error
    } finally {
      setLoading(false);
    }
  }

  // Don't render anything if not needed
  if (checking || !visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-xl font-bold mb-2">Before you continue</h2>
          <p className="text-sm text-muted">
            Please review and accept our legal documents to use PostPilot AI.
          </p>
        </div>

        {/* Checkboxes */}
        <div className="px-6 space-y-3">
          <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-sidebar-hover transition-colors">
            <input
              type="checkbox"
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
            />
            <span className="text-sm text-muted leading-relaxed">
              I have read and accept the{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="font-medium text-accent hover:text-accent-hover underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-sidebar-hover transition-colors">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
            />
            <span className="text-sm text-muted leading-relaxed">
              I have read and accept the{" "}
              <Link
                href="/terms-of-service"
                target="_blank"
                className="font-medium text-accent hover:text-accent-hover underline"
              >
                Terms of Service
              </Link>
            </span>
          </label>
        </div>

        {/* Button */}
        <div className="p-6 pt-4">
          <button
            onClick={handleAccept}
            disabled={!privacyChecked || !termsChecked || loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "I accept and continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
