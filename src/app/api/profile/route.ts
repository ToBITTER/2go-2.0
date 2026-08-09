import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getUserFromSession, updateUser } from "@/lib/store";

const profileSchema = z.object({
  displayName: z.string().min(2),
  bio: z.string().min(2).max(160),
  picture: z.string().url().optional(),
});

const onboardingSchema = z.object({
  interests: z.array(z.string()).max(6),
  bio: z.string().min(2).max(160),
});

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid onboarding data" }, { status: 400 });

  const updated = await updateUser(user.id, { bio: parsed.data.bio, interests: parsed.data.interests });
  return NextResponse.json({ user: updated });
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });

  const updated = await updateUser(user.id, parsed.data);
  return NextResponse.json({ user: updated });
}
