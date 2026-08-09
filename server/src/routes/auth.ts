import { Router } from "express";
import { z } from "zod";
import {
  createSession,
  createUser,
  deleteSession,
  findUserByEmail,
  getUserFromSession,
  seedDemoUser,
} from "../lib/store.js";
import { clearSessionCookie, getCookie, setSessionCookie } from "../lib/http.js";

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

function publicUser(user: ReturnType<typeof getUserFromSession> extends infer T ? T : never) {
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

seedDemoUser();

authRouter.post("/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid registration details" });
  }

  try {
    const user = createUser(parsed.data);
    const token = createSession(user.id);
    setSessionCookie(res, token);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return res.status(409).json({ error: error instanceof Error ? error.message : "Unable to register" });
  }
});

authRouter.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid login details" });
  }

  const user = findUserByEmail(parsed.data.email);
  if (!user || user.password !== parsed.data.password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = createSession(user.id);
  setSessionCookie(res, token);
  return res.json({ user: publicUser(user) });
});

authRouter.get("/me", (req, res) => {
  const user = getUserFromSession(getCookie(req, "2go_session"));
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  return res.json({ user: publicUser(user) });
});

authRouter.post("/logout", (req, res) => {
  const token = getCookie(req, "2go_session");
  if (token) deleteSession(token);
  clearSessionCookie(res);
  return res.json({ ok: true });
});
