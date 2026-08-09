import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { interestsRouter } from "./routes/interests.js";
import { profileRouter } from "./routes/profile.js";

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(helmet());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/", (_, res) => {
    res.json({
      name: "2go 2.0 API",
      status: "ok",
      message: "Phase 0 backend foundation is live.",
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/interests", interestsRouter);
  app.use("/api/profile", profileRouter);

  app.use((_, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
