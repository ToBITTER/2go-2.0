import crypto from "crypto";

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio: string;
  rank: string;
  interests: string[];
  picture?: string;
};

export type SessionRecord = {
  token: string;
  userId: string;
  createdAt: string;
};

const users = new Map<string, UserRecord>();
const sessions = new Map<string, SessionRecord>();

export const defaultInterests = [
  "Football",
  "Music",
  "Tech",
  "Gaming",
  "Movies",
  "Fashion",
  "Campus",
  "Business",
  "Relationships",
  "Faith",
  "Memes",
  "Anime",
  "Sports",
];

function rankFor(user: UserRecord) {
  if (user.interests.length >= 6) return "Professional";
  if (user.interests.length >= 3) return "Amateur";
  return "Novice";
}

export function createUser(input: {
  username: string;
  email: string;
  password: string;
  displayName: string;
}) {
  if ([...users.values()].some((user) => user.email === input.email || user.username === input.username)) {
    throw new Error("User already exists");
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    username: input.username,
    email: input.email,
    password: input.password,
    displayName: input.displayName,
    bio: "New to 2go 2.0",
    rank: "Novice",
    interests: [],
  };

  users.set(user.id, user);
  return user;
}

export function findUserByEmail(email: string) {
  return [...users.values()].find((user) => user.email === email);
}

export function findUserById(id: string) {
  return users.get(id);
}

export function findUserByUsername(username: string) {
  return [...users.values()].find((user) => user.username === username);
}

export function updateUser(userId: string, patch: Partial<Pick<UserRecord, "displayName" | "bio" | "picture" | "interests">>) {
  const user = users.get(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (patch.displayName !== undefined) user.displayName = patch.displayName;
  if (patch.bio !== undefined) user.bio = patch.bio;
  if (patch.picture !== undefined) user.picture = patch.picture;
  if (patch.interests !== undefined) {
    user.interests = patch.interests;
    user.rank = rankFor(user);
  }

  return user;
}

export function createSession(userId: string) {
  const token = crypto.randomUUID();
  sessions.set(token, {
    token,
    userId,
    createdAt: new Date().toISOString(),
  });
  return token;
}

export function deleteSession(token: string) {
  sessions.delete(token);
}

export function getUserFromSession(token: string | undefined) {
  if (!token) return undefined;
  const session = sessions.get(token);
  if (!session) return undefined;
  return users.get(session.userId);
}

export function seedDemoUser() {
  if (users.size > 0) return;
  const user = createUser({
    username: "tobitter",
    email: "praise@2go.local",
    password: "password",
    displayName: "Praise",
  });
  updateUser(user.id, {
    bio: "Building things - Backend - FinTech - AI",
    interests: ["Tech", "Football", "Music"],
  });
  createSession(user.id);
}
