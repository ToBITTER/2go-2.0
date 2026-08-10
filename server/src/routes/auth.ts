import { Router } from "express";
import { z } from "zod";
import {
  createSession,
  createUser,
  deleteSession,
  findUserByEmail,
  isUsernameAvailable,
  getUserFromSession,
} from "../lib/store.js";
import { clearSessionCookie, getCookie, setSessionCookie } from "../lib/http.js";
import type { UserRecord } from "../lib/store.js";

export const authRouter = Router();

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function publicUser(user: UserRecord) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    bio: user.bio,
    rank: user.rank,
    interests: user.interests,
    picture: user.picture,
  };
}

authRouter.get("/username-available", async (req, res) => {
  const username = String(req.query.username ?? "").trim();

  if (username.length < 3) {
    return res.status(400).json({ error: "Username too short" });
  }

  const available = await isUsernameAvailable(username);
  return res.json({ available });
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid registration details" });
  }

  try {
    const user = await createUser(parsed.data);
    const token = await createSession(user.id);
    setSessionCookie(res, token);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return res.status(409).json({ error: error instanceof Error ? error.message : "Unable to register" });
  }
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid login details" });
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user || user.password !== parsed.data.password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = await createSession(user.id);
  setSessionCookie(res, token);
  return res.json({ user: publicUser(user) });
});

authRouter.get("/me", async (req, res) => {
  const user = await getUserFromSession(getCookie(req, "2go_session"));
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  return res.json({ user: publicUser(user) });
});

authRouter.post("/logout", async (req, res) => {
  const token = getCookie(req, "2go_session");
  if (token) await deleteSession(token);
  clearSessionCookie(res);
  return res.json({ ok: true });
});
