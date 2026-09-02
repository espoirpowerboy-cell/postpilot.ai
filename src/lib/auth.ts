// Supabase Auth integration with Prisma user sync.
// This is the SINGLE source of truth for authentication in the app.
// Supabase Auth handles identity, passwords, and sessions.
// Prisma User stores application-specific profile data.

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// ─── Types ───────────────────────────────────────────────────

export interface AuthUser {
  /** The Supabase Auth user ID (auth.users.id) */
  supabaseUserId: string;
  /** The Prisma User ID (public.users.id) */
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
}

// ─── Core: Get current authenticated user ────────────────────

/**
 * Get the currently authenticated user.
 *
 * 1. Reads the Supabase session from cookies.
 * 2. Finds or creates the corresponding Prisma User record.
 * 3. Returns the combined auth + profile data, or null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Sync Supabase Auth user with Prisma User
    const prismaUser = await syncPrismaUser(user.id, user.email!, user.user_metadata);

    return {
      supabaseUserId: user.id,
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      avatarUrl: prismaUser.avatarUrl,
      role: prismaUser.role,
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

/**
 * Get the authenticated user's Prisma ID.
 * Returns null if not authenticated.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

/**
 * Require authentication — throws if not authenticated.
 * Returns the Prisma User ID.
 */
export async function requireAuth(): Promise<string> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

// ─── Prisma User sync ────────────────────────────────────────

/**
 * Find or create a Prisma User record that matches the Supabase Auth user.
 *
 * Lookup strategy:
 * 1. By supabaseUserId (fast path — most common)
 * 2. By email (handles first-time login for existing seed/demo users)
 * 3. Create new Prisma User (brand new signups)
 *
 * IMPORTANT: This never deletes or overwrites existing application data.
 */
async function syncPrismaUser(
  supabaseUserId: string,
  email: string,
  userMetadata: Record<string, unknown> | null,
) {
  const normalizedEmail = email.toLowerCase().trim();
  const nameFromMetadata = (userMetadata?.name as string) ?? null;
  const avatarFromMetadata = (userMetadata?.avatar_url as string) ?? null;

  // 1. Lookup by supabaseUserId
  let prismaUser = await prisma.user.findUnique({
    where: { supabaseUserId },
  });

  if (prismaUser) {
    return prismaUser;
  }

  // 2. Lookup by email (may be a pre-existing seed/demo user)
  prismaUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (prismaUser) {
    // Link the existing Prisma user to this Supabase Auth account
    prismaUser = await prisma.user.update({
      where: { id: prismaUser.id },
      data: {
        supabaseUserId,
        // Update name/avatar if they were missing
        ...(nameFromMetadata && !prismaUser.name && { name: nameFromMetadata }),
        ...(avatarFromMetadata && !prismaUser.avatarUrl && { avatarUrl: avatarFromMetadata }),
      },
    });
    return prismaUser;
  }

  // 3. Create new Prisma User
  prismaUser = await prisma.user.create({
    data: {
      supabaseUserId,
      email: normalizedEmail,
      name: nameFromMetadata,
      avatarUrl: avatarFromMetadata,
      role: "MEMBER",
      // Create a default FREE subscription
      subscription: {
        create: {
          plan: "FREE",
          status: "ACTIVE",
        },
      },
    },
  });

  return prismaUser;
}
