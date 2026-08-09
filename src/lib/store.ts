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
