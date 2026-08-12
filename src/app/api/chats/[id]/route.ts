import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, getConversationById, createMessage } from "@/lib/store";
import { emitConversationMessage } from "@/lib/realtime-server";
import { z } from "zod";

function toParticipantPayload(participant: {
  id: string;
  username: string;
  displayName: string;
  rank: string;
  picture: string | null;
}) {
  return {
    id: participant.id,
    username: participant.username,
    displayName: participant.displayName,
    rank: participant.rank,
    picture: participant.picture,
  };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const conversation = await getConversationById(id, user.id);
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      participants: conversation.participants.map((participant: { user: Parameters<typeof toParticipantPayload>[0] }) =>
        toParticipantPayload(participant.user),
      ),
      messages: conversation.messages.map(
        (message: {
          id: string;
          body: string;
          createdAt: Date;
          sender: Parameters<typeof toParticipantPayload>[0];
        }) => ({
          id: message.id,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
          sender: toParticipantPayload(message.sender),
        }),
      ),
    },
  });
}

const messageSchema = z.object({
  body: z.string().min(1).max(500),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const conversation = await getConversationById(id, user.id);
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });

  const message = await createMessage(id, user.id, parsed.data.body.trim());
  emitConversationMessage({
    conversationId: id,
    message: {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        displayName: message.sender.displayName,
        rank: message.sender.rank,
        picture: message.sender.picture,
      },
    },
  });
  return NextResponse.json({
    message: {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        displayName: message.sender.displayName,
        rank: message.sender.rank,
        picture: message.sender.picture,
      },
    },
  });
}
