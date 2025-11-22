// src/app/api/crm/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Get the logged-in user session
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  // Parse request body safely
  const body = await req.json().catch(() => ({} as any));
  const { raw, processed, type } = body as {
    raw?: string;
    processed?: string;
    type?: string;
  };

  if (!processed) {
    return NextResponse.json(
      { error: "Missing data to save." },
      { status: 400 }
    );
  }

  // Find the Prisma user by email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found in database." },
      { status: 404 }
    );
  }

  // Create CRM record tied to this user
  const saved = await prisma.cRMRecord.create({
    data: {
      userId: user.id,
      raw: raw ?? "",
      processed,
      type: type ?? "general",
    },
  });

  return NextResponse.json({
    success: true,
    record: saved,
  });
}