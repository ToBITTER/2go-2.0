import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createRoomMessage, getRoomBySlug, getUserFromSession, listRoomMessages } from "@/lib/store";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  const messages = await listRoomMessages(room.id);

  return NextResponse.json({
    room: {
      id: room.id,
      slug: room.slug,
      name: room.name,
      description: room.description,
      category: room.category,
      online: Math.max(0, messages.length * 12 + 24),
      members: Math.max(0, messages.length * 100 + 200),
      lastMessage: messages.at(-1)?.body ?? "Say something to start the room.",
      lastMessageAt: room.updatedAt.toISOString(),
    },
    messages,
  });
}

const roomMessageSchema = z.object({
  body: z.string().min(1).max(500),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = roomMessageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });

  const message = await createRoomMessage(room.id, user.id, parsed.data.body.trim());
  return NextResponse.json({ message });
}
