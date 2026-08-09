import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, listConversations, findUserByUsername, getOrCreateDirectConversation } from "@/lib/store";
import { z } from "zod";

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const chats = await listConversations(user.id);
  return NextResponse.json({ chats });
}

const startSchema = z.object({
  username: z.string().min(3),
});

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = startSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid chat request" }, { status: 400 });

  const target = await findUserByUsername(parsed.data.username);
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const conversation = await getOrCreateDirectConversation(user.id, target.id);
  return NextResponse.json({ conversationId: conversation.id });
}
