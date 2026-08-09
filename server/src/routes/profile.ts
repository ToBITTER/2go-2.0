import { Router } from "express";
import { z } from "zod";
import { getCookie } from "../lib/http.js";
import { findUserByUsername, getUserFromSession, updateUser, type UserRecord } from "../lib/store.js";

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

function publicUser(user: UserRecord) {
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

profileRouter.post("/onboarding", async (req, res) => {
  const user = await getUserFromSession(getCookie(req, "2go_session"));
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const parsed = onboardingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid onboarding data" });

  const updated = await updateUser(user.id, {
    bio: parsed.data.bio,
    interests: parsed.data.interests,
  });
  return res.json({ user: publicUser(updated) });
});

profileRouter.put("/", async (req, res) => {
  const user = await getUserFromSession(getCookie(req, "2go_session"));
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid profile data" });

  const updated = await updateUser(user.id, parsed.data);
  return res.json({ user: publicUser(updated) });
});

profileRouter.get("/:username", async (req, res) => {
  const user = await findUserByUsername(req.params.username);
  if (!user) return res.status(404).json({ error: "Profile not found" });
  return res.json({ user: publicUser(user) });
});
