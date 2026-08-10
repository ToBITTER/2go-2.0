import crypto from "crypto";
import { prisma } from "./db";

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio: string;
  rank: string;
  interests: string[];
  picture?: string | null;
};

export type ConversationSummary = {
  id: string;
  title: string;
  subtitle: string;
  unread: number;
  lastMessage: string;
  lastMessageAt: string;
  members: Array<Pick<UserRecord, "id" | "username" | "displayName" | "rank" | "picture">>;
};

export type ChatMessage = {
  id: string;
  body: string;
  createdAt: string;
  sender: Pick<UserRecord, "id" | "username" | "displayName" | "rank" | "picture">;
};

export type RoomSummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  online: number;
  members: number;
  lastMessage: string;
  lastMessageAt: string;
};

export type RoomMessage = {
  id: string;
  body: string;
  createdAt: string;
  sender: Pick<UserRecord, "id" | "username" | "displayName" | "rank" | "picture">;
};

export const defaultInterests = ["Football", "Music", "Tech", "Gaming", "Movies", "Fashion", "Campus", "Business", "Relationships", "Faith", "Memes", "Anime", "Sports"];

function rankFor(interests: string[]) {
  if (interests.length >= 6) return "Professional";
  if (interests.length >= 3) return "Amateur";
  return "Novice";
}

function toUserRecord(user: {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  bio: string;
  rank: string;
  interests: unknown;
  picture: string | null;
}): UserRecord {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.passwordHash,
    displayName: user.displayName,
    bio: user.bio,
    rank: user.rank,
    interests: Array.isArray(user.interests) ? user.interests.filter((item): item is string => typeof item === "string") : [],
    picture: user.picture,
  };
}

export async function createUser(input: { username: string; email: string; password: string; displayName: string }) {
  const existing = await prisma.user.findFirst({ where: { OR: [{ email: input.email }, { username: input.username }] } });
  if (existing) throw new Error("User already exists");

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash: input.password,
      displayName: input.displayName,
      bio: "New to 2go 2.0",
      rank: "Novice",
      interests: [],
    },
  });
  return toUserRecord(user);
}

export async function isUsernameAvailable(username: string) {
  const existing = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  return !existing;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user ? toUserRecord(user) : undefined;
}

export async function findUserByUsername(username: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  return user ? toUserRecord(user) : undefined;
}

export async function listUsers(excludeUserId?: string) {
  const users = await prisma.user.findMany({
    where: excludeUserId ? { id: { not: excludeUserId } } : undefined,
    orderBy: { updatedAt: "desc" },
    take: 24,
  });
  return users.map(toUserRecord);
}

export async function updateUser(userId: string, patch: Partial<Pick<UserRecord, "displayName" | "bio" | "picture" | "interests">>) {
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (!current) throw new Error("User not found");
  const interests = patch.interests ?? (Array.isArray(current.interests) ? (current.interests as string[]) : []);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: patch.displayName ?? current.displayName,
      bio: patch.bio ?? current.bio,
      picture: patch.picture === undefined ? current.picture : patch.picture,
      interests,
      rank: rankFor(interests),
    },
  });
  return toUserRecord(updated);
}

export async function createSession(userId: string) {
  const session = await prisma.session.create({
    data: { userId, token: crypto.randomUUID(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
  });
  return session.token;
}

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({ where: { token } });
}

export async function getUserFromSession(token: string | undefined) {
  if (!token) return undefined;
  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { token } }).catch(() => undefined);
    return undefined;
  }
  return toUserRecord(session.user);
}

export async function seedDemoUser() {
  return;
}

function toConversationSummary(conversation: {
  id: string;
  updatedAt: Date;
  messages: Array<{
    body: string;
    createdAt: Date;
    sender: {
      id: string;
      username: string;
      displayName: string;
      rank: string;
      picture: string | null;
    };
  }>;
  participants: Array<{
    user: {
      id: string;
      username: string;
      displayName: string;
      rank: string;
      picture: string | null;
    };
  }>;
}): ConversationSummary {
  const members = conversation.participants.map(({ user }) => ({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    rank: user.rank,
    picture: user.picture,
  }));
  const other = members[0];
  const lastMessage = conversation.messages[0];
  return {
    id: conversation.id,
    title: other ? other.displayName : "Conversation",
    subtitle: other ? `@${other.username}` : "Private chat",
    unread: 0,
    lastMessage: lastMessage?.body ?? "Say hello",
    lastMessageAt: conversation.updatedAt.toISOString(),
    members,
  };
}

export async function listConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: { include: { user: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return conversations.map((conversation) => toConversationSummary(conversation));
}

export async function getConversationById(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, participants: { some: { userId } } },
    include: {
      participants: { include: { user: true } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });
  if (!conversation) return null;
  return conversation;
}

export async function getOrCreateDirectConversation(userId: string, otherUserId: string) {
  const existing = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          OR: [{ userId }, { userId: otherUserId }],
        },
      },
    },
    include: { participants: true },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId }, { userId: otherUserId }],
      },
    },
  });
}

export async function createMessage(conversationId: string, senderId: string, body: string) {
  const message = await prisma.message.create({
    data: { conversationId, senderId, body },
    include: { sender: true },
  });
  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
  return message;
}

function toRoomMessagePayload(message: {
  id: string;
  body: string;
  createdAt: Date;
  sender: {
    id: string;
    username: string;
    displayName: string;
    rank: string;
    picture: string | null;
  };
}): RoomMessage {
  return {
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
  };
}

export async function listRooms() {
  const rooms = await prisma.room.findMany({
    orderBy: { updatedAt: "desc" },
    take: 6,
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return rooms.map((room) => ({
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    category: room.category,
    online: Math.max(0, room.messages.length * 12 + 24),
    members: Math.max(0, room.messages.length * 100 + 200),
    lastMessage: room.messages[0]?.body ?? "Say something to start the room.",
    lastMessageAt: room.updatedAt.toISOString(),
  })) satisfies RoomSummary[];
}

export async function getRoomBySlug(slug: string) {
  const room = await prisma.room.findUnique({
    where: { slug },
    include: {
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });
  return room;
}

export async function createRoomMessage(roomId: string, senderId: string, body: string) {
  const message = await prisma.roomMessage.create({
    data: { roomId, senderId, body },
    include: { sender: true },
  });
  await prisma.room.update({ where: { id: roomId }, data: { updatedAt: new Date() } });
  return toRoomMessagePayload(message);
}

export async function listRoomMessages(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { sender: true } } },
  });
  return room?.messages.map(toRoomMessagePayload) ?? [];
}

export async function listRoomsByCategory() {
  return listRooms();
}
