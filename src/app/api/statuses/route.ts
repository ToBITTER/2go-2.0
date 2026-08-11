import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createStatusUpdate, getUserFromSession, listStatusUpdates } from "@/lib/store";
import { z } from "zod";

export async function GET() {
  const statuses = await listStatusUpdates();
  return NextResponse.json({ statuses });
}

const statusSchema = z.object({
  body: z.string().min(1).max(120),
});

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Status cannot be empty" }, { status: 400 });

  const status = await createStatusUpdate(user.id, parsed.data.body.trim());
  return NextResponse.json({ status }, { status: 201 });
}
