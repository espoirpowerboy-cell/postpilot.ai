// GET /api/legal/consent — Returns the current user's legal consent status
// POST /api/legal/consent — Records the user's acceptance of privacy policy and terms

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        acceptedPrivacyPolicyAt: true,
        acceptedTermsAt: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      acceptedPrivacyPolicy: dbUser.acceptedPrivacyPolicyAt !== null,
      acceptedTerms: dbUser.acceptedTermsAt !== null,
      acceptedPrivacyPolicyAt: dbUser.acceptedPrivacyPolicyAt?.toISOString() ?? null,
      acceptedTermsAt: dbUser.acceptedTermsAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Legal consent GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { acceptedPrivacyPolicy, acceptedTerms } = body;

    if (typeof acceptedPrivacyPolicy !== "boolean" || typeof acceptedTerms !== "boolean") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!acceptedPrivacyPolicy || !acceptedTerms) {
      return NextResponse.json({ error: "Both privacy policy and terms must be accepted" }, { status: 400 });
    }

    const now = new Date();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        acceptedPrivacyPolicyAt: now,
        acceptedTermsAt: now,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Legal consent POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
