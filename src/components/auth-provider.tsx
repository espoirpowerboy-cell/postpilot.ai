"use client";

// AuthProvider is now a passthrough component.
// Supabase Auth manages sessions via cookies (set by middleware and the Supabase client).
// No client-side session provider is needed.

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
