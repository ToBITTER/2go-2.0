import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  createRoomMessage,
  getRoomBySlugForUser,
  getUserFromSession,
  joinRoom,
  listRoomMessages,
  isRoomJoined,
} from "@/lib/store";
import { prisma } from "@/lib/db";
import { emitRoomMessage, emitRoomPresence } from "@/lib/realtime-server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { slug } = await params;
  const room = await getRoomBySlugForUser(slug, user.id);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  const messages = await listRoomMessages(room.id);
  const joined = await isRoomJoined(room.id, user.id);
  const members = await prisma.roomMembership.count({ where: { roomId: room.id } });

  return NextResponse.json({
    room: {
      id: room.id,
      slug: room.slug,
      name: room.name,
      description: room.description,
      category: room.category,
      online: members,
      members,
      joined,
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
  const room = await getRoomBySlugForUser(slug, user.id);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (body?.action === "join") {
    await joinRoom(room.id, user.id);
    emitRoomPresence({ roomSlug: slug, onlineUserIds: [] });
    return NextResponse.json({ joined: true });
  }

  const parsed = roomMessageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });

  const alreadyJoined = await isRoomJoined(room.id, user.id);
  if (!alreadyJoined) {
    return NextResponse.json({ error: "Join the room first" }, { status: 403 });
  }

  const message = await createRoomMessage(room.id, user.id, parsed.data.body.trim());
  emitRoomMessage({
    roomSlug: slug,
    message: {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        displayName: message.sender.displayName,
        rank: message.sender.rank,
        picture: message.sender.picture ?? null,
      },
    },
  });
  return NextResponse.json({ message });
}
