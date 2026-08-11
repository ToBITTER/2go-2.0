import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createReport, getUserFromSession } from "@/lib/store";

const reportSchema = z.object({
  reason: z.string().min(3).max(120),
  details: z.string().max(300).optional(),
  reportedUsername: z.string().min(3).optional(),
  conversationId: z.string().min(1).optional(),
  roomSlug: z.string().min(1).optional(),
});

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid report data" }, { status: 400 });

  const report = await createReport({
    reporterId: user.id,
    reason: parsed.data.reason,
    details: parsed.data.details,
    reportedUsername: parsed.data.reportedUsername,
    conversationId: parsed.data.conversationId,
    roomSlug: parsed.data.roomSlug,
  });

  return NextResponse.json({ report }, { status: 201 });
}
