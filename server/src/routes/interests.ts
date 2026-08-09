import { Router } from "express";
import { defaultInterests } from "../lib/store.js";

export const interestsRouter = Router();

interestsRouter.get("/", (_req, res) => {
  res.json({ interests: defaultInterests });
});
