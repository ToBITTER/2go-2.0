import { Router } from "express";
import { z } from "zod";
import { getCookie } from "../lib/http.js";
import { findUserByUsername, getUserFromSession, updateUser } from "../lib/store.js";

export const profileRouter = Router();

const onboardingSchema = z.object({
  interests: z.array(z.string()).max(6),
  bio: z.string().min(2).max(160),
});

const profileSchema = z.object({
  displayName: z.string().min(2),
  bio: z.string().min(2).max(160),
  picture: z.string().url().optional(),
});

function publicUser(user: NonNullable<ReturnType<typeof getUserFromSession>>) {
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

profileRouter.post("/onboarding", (req, res) => {
  const user = getUserFromSession(getCookie(req, "2go_session"));
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const parsed = onboardingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid onboarding data" });

  const updated = updateUser(user.id, {
    bio: parsed.data.bio,
    interests: parsed.data.interests,
  });
  return res.json({ user: publicUser(updated) });
});

profileRouter.put("/", (req, res) => {
  const user = getUserFromSession(getCookie(req, "2go_session"));
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid profile data" });

  const updated = updateUser(user.id, parsed.data);
  return res.json({ user: publicUser(updated) });
});

profileRouter.get("/:username", (req, res) => {
  const user = findUserByUsername(req.params.username);
  if (!user) return res.status(404).json({ error: "Profile not found" });
  return res.json({ user: publicUser(user) });
});
