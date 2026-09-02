// Server-side data access layer.
// All database operations go through these functions.
// NEVER import this in client components — it requires server context.

export { getDashboardStats, getRecentActivity } from "./dashboard";
export { getPosts, getScheduledPosts, getPostById, createPost, updatePost } from "./posts";
export { getComments, getCommentById, replyToComment } from "./comments";
export { getAutomations, getAutomationById, createAutomation, toggleAutomation } from "./automations";
export { getClients, getClientById, createClient, updateClient } from "./clients";
export { getAnalyticsOverview, getViewsOverTime, getEngagementBreakdown, getTopPosts, getAudienceDemographics, getAudienceGrowth } from "./analytics";
export { getCalendarEvents } from "./calendar";
export { getSocialAccount, getSocialAccounts } from "./social-accounts";
export { getNotifications, getUnreadNotificationCount } from "./notifications";
