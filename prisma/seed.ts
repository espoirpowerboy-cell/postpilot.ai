// Prisma seed script for development.
// Run: npx prisma db seed

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Create demo user ────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: "alex@postpilot.ai" },
    update: {},
    create: {
      email: "alex@postpilot.ai",
      name: "Alex Johnson",
      role: "OWNER",
    },
  });
  console.log(`✅ User: ${user.name} (${user.email})`);

  // ─── Create subscription ──────────────────────────────────────
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      plan: "PRO",
      status: "ACTIVE",
    },
  });
  console.log("✅ Subscription: Pro Plan");

  // ─── Create social account ────────────────────────────────────
  const socialAccount = await prisma.socialAccount.upsert({
    where: { provider_providerAccountId: { provider: "TIKTOK", providerAccountId: "postpilot_ai" } },
    update: {},
    create: {
      userId: user.id,
      provider: "TIKTOK",
      providerAccountId: "postpilot_ai",
      username: "postpilot_ai",
      displayName: "PostPilot AI",
      bio: "AI-powered content management for creators 🚀",
      followers: 57847,
      following: 234,
      totalLikes: 892400,
      totalVideos: 247,
      profileViews: 125000,
      isProAccount: true,
    },
  });
  console.log(`✅ Social Account: @${socialAccount.username}`);

  // ─── Create posts ─────────────────────────────────────────────
  const postData = [
    {
      title: "10 Tips for Better Content Creation",
      content: "Creating engaging content doesn't have to be hard. Here are my top 10 tips...",
      status: "PUBLISHED" as const,
      scheduledDate: new Date("2026-08-30T10:00:00Z"),
      publishedDate: new Date("2026-08-30T10:00:00Z"),
      likes: 12400,
      commentsCount: 342,
      shares: 890,
      views: 245000,
    },
    {
      title: "Behind the Scenes: Our Studio Setup",
      content: "Ever wondered where the magic happens? Take a peek behind the curtain...",
      status: "SCHEDULED" as const,
      scheduledDate: new Date("2026-09-02T14:00:00Z"),
      likes: 0,
      commentsCount: 0,
      shares: 0,
      views: 0,
    },
    {
      title: "Q&A: Answering Your Top Questions",
      content: "You asked, we answered! Here are responses to your most popular questions...",
      status: "DRAFT" as const,
      likes: 0,
      commentsCount: 0,
      shares: 0,
      views: 0,
    },
    {
      title: "Trending Dance Challenge 2026",
      content: "Jumping on the latest trend! Here's our take on the viral dance challenge...",
      status: "PUBLISHED" as const,
      scheduledDate: new Date("2026-08-28T15:00:00Z"),
      publishedDate: new Date("2026-08-28T15:00:00Z"),
      likes: 45200,
      commentsCount: 1230,
      shares: 3400,
      views: 890000,
    },
    {
      title: "Product Review: New Tech Gadget",
      content: "Is this gadget worth the hype? Let's break it down together...",
      status: "SCHEDULED" as const,
      scheduledDate: new Date("2026-09-04T10:00:00Z"),
      likes: 0,
      commentsCount: 0,
      shares: 0,
      views: 0,
    },
    {
      title: "Day in the Life of a Creator",
      content: "Follow me through a typical day of content creation, meetings, and editing...",
      status: "PUBLISHED" as const,
      scheduledDate: new Date("2026-08-25T11:00:00Z"),
      publishedDate: new Date("2026-08-25T11:00:00Z"),
      likes: 67800,
      commentsCount: 2100,
      shares: 5600,
      views: 1200000,
    },
  ];

  for (const p of postData) {
    await prisma.post.upsert({
      where: { id: `seed-${p.title.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}` },
      update: p,
      create: {
        id: `seed-${p.title.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`,
        userId: user.id,
        socialAccountId: socialAccount.id,
        ...p,
      },
    });
  }
  console.log(`✅ Posts: ${postData.length} created`);

  // ─── Create comments ──────────────────────────────────────────
  const posts = await prisma.post.findMany({ where: { userId: user.id } });
  const publishedPost = posts.find((p) => p.status === "PUBLISHED");

  if (publishedPost) {
    const commentData = [
      { authorName: "sarah_designs", content: "This is exactly what I needed! Thank you so much 🙏", sentiment: "POSITIVE" as const },
      { authorName: "techguru_mike", content: "Great video but I think tip #5 could use more explanation", sentiment: "NEUTRAL" as const },
      { authorName: "creative_luna", content: "Love your content! Would love to see a tutorial on editing 🎬", sentiment: "POSITIVE" as const, replied: true },
      { authorName: "skeptic_joe", content: "Not sure this applies to everyone, my niche is different", sentiment: "NEUTRAL" as const },
      { authorName: "fan_anna", content: "You're crushing it! The dance challenge was 🔥🔥🔥", sentiment: "POSITIVE" as const, replied: true },
    ];

    for (const c of commentData) {
      await prisma.comment.create({
        data: {
          userId: user.id,
          socialAccountId: socialAccount.id,
          postId: publishedPost.id,
          authorName: c.authorName,
          content: c.content,
          sentiment: c.sentiment,
          replied: c.replied ?? false,
        },
      });
    }
    console.log(`✅ Comments: ${commentData.length} created`);
  }

  // ─── Create automation rules ──────────────────────────────────
  const automationData = [
    { name: "Auto-Reply to Positive Comments", description: "Automatically responds to positive comments with a thank-you message", trigger: "New positive comment", action: "Send auto-reply", runCount: 342, successRate: 98.5 },
    { name: "Welcome New Followers", description: "Sends a welcome DM to accounts that follow you", trigger: "New follower", action: "Send welcome DM", runCount: 1247, successRate: 95.2 },
    { name: "Post Schedule Reminder", description: "Notifies you 30 minutes before a scheduled post", trigger: "30 min before scheduled post", action: "Send notification", runCount: 89, successRate: 100 },
    { name: "Flag Negative Comments", description: "Flags potentially harmful or negative comments for review", trigger: "New comment", action: "Flag for review", status: "PAUSED" as const, runCount: 56, successRate: 87.5 },
  ];

  for (const a of automationData) {
    await prisma.automationRule.create({
      data: { userId: user.id, ...a },
    });
  }
  console.log(`✅ Automations: ${automationData.length} created`);

  // ─── Create clients ───────────────────────────────────────────
  const clientData = [
    { name: "TechCorp Inc.", industry: "Technology", status: "ACTIVE" as const, postsManaged: 24, followers: 156000, engagementRate: 4.2, monthlyRevenue: 2400, nextPostDate: new Date("2026-09-02") },
    { name: "GreenLeaf Organics", industry: "Health & Wellness", status: "ACTIVE" as const, postsManaged: 18, followers: 89000, engagementRate: 5.1, monthlyRevenue: 1800, nextPostDate: new Date("2026-09-03") },
    { name: "UrbanStyle Fashion", industry: "Fashion", status: "ACTIVE" as const, postsManaged: 31, followers: 234000, engagementRate: 3.8, monthlyRevenue: 3200, nextPostDate: new Date("2026-09-01") },
    { name: "FitnessPro Studio", industry: "Fitness", status: "PAUSED" as const, postsManaged: 12, followers: 67000, engagementRate: 6.3, monthlyRevenue: 1200 },
    { name: "Artisan Coffee Co.", industry: "Food & Beverage", status: "ACTIVE" as const, postsManaged: 15, followers: 45000, engagementRate: 4.9, monthlyRevenue: 1500, nextPostDate: new Date("2026-09-04") },
    { name: "Wanderlust Travel", industry: "Travel", status: "PROSPECT" as const, followers: 312000 },
  ];

  for (const c of clientData) {
    await prisma.client.create({
      data: { userId: user.id, ...c },
    });
  }
  console.log(`✅ Clients: ${clientData.length} created`);

  // ─── Create notifications ─────────────────────────────────────
  const notificationData = [
    { type: "POST_PUBLISHED" as const, title: "Post Published", message: "New post published: \"10 Tips for Better Content\"", read: false },
    { type: "NEW_COMMENT" as const, title: "New Comment", message: "New comment from @sarah_designs", read: false },
    { type: "AUTOMATION_ALERT" as const, title: "Automation", message: "Auto-reply sent to 3 comments", read: true },
    { type: "SYSTEM" as const, title: "Error", message: "Failed to post scheduled content", read: true },
    { type: "POST_PUBLISHED" as const, title: "Draft Saved", message: "Draft saved: \"Behind the Scenes\"", read: true },
    { type: "BILLING" as const, title: "New Client", message: "New client added: TechCorp Inc.", read: true },
  ];

  for (const n of notificationData) {
    await prisma.notification.create({
      data: { userId: user.id, ...n },
    });
  }
  console.log(`✅ Notifications: ${notificationData.length} created`);

  console.log("\n🎉 Seed complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
