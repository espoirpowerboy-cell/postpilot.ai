// Zod validation schemas for all data models.
// Used for validating user input and ensuring type safety.

import { z } from "zod";

// ─── User ────────────────────────────────────────────────────

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ─── Post ────────────────────────────────────────────────────

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  content: z.string().max(5000).optional(),
  platform: z.enum(["TIKTOK", "INSTAGRAM", "YOUTUBE"]).default("TIKTOK"),
  scheduledDate: z.coerce.date().nullable().optional(),
  status: z.enum(["DRAFT", "SCHEDULED"]).default("DRAFT"),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().max(5000).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED"]).optional(),
  scheduledDate: z.coerce.date().nullable().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// ─── Comment ─────────────────────────────────────────────────

export const replyToCommentSchema = z.object({
  commentId: z.string().cuid(),
  replyContent: z.string().min(1, "Reply cannot be empty").max(2000),
});

export type ReplyToCommentInput = z.infer<typeof replyToCommentSchema>;

// ─── Automation Rule ─────────────────────────────────────────

export const createAutomationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(1000).optional(),
  trigger: z.string().min(1, "Trigger is required"),
  action: z.string().min(1, "Action is required"),
  config: z.record(z.unknown()).nullable().optional(),
});

export const updateAutomationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "ERROR"]).optional(),
  trigger: z.string().optional(),
  action: z.string().optional(),
  config: z.record(z.unknown()).nullable().optional(),
});

export type CreateAutomationInput = z.infer<typeof createAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof updateAutomationSchema>;

// ─── Client ──────────────────────────────────────────────────

export const createClientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(200),
  industry: z.string().max(200).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "PROSPECT"]).default("ACTIVE"),
  monthlyRevenue: z.coerce.number().positive().optional(),
  notes: z.string().max(5000).optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  industry: z.string().max(200).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "PROSPECT", "ARCHIVED"]).optional(),
  monthlyRevenue: z.coerce.number().positive().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  nextPostDate: z.coerce.date().nullable().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

// ─── Social Account ──────────────────────────────────────────

export const connectSocialAccountSchema = z.object({
  provider: z.enum(["TIKTOK", "INSTAGRAM", "YOUTUBE"]),
  providerAccountId: z.string().min(1),
  username: z.string().min(1),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
});

export type ConnectSocialAccountInput = z.infer<typeof connectSocialAccountSchema>;

// ─── Settings ────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().nullable().optional(),
  timezone: z.string().optional(),
});

export const updateNotificationPreferencesSchema = z.object({
  postPublished: z.boolean().optional(),
  newComment: z.boolean().optional(),
  commentReply: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  automationAlerts: z.boolean().optional(),
  mentionAlerts: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
