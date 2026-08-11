import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { getSessionTokenFromRequest } from "./lib/socket.js";
import { getUserFromSession } from "./lib/store.js";

type SocketEvent = "presence:update" | "chat:typing" | "room:typing" | "room:presence";

const onlineUsers = new Map<string, { socketId: string; userId: string; username: string }>();

export function attachSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: (process.env.CLIENT_ORIGIN ?? "http://localhost:3000").split(",").map((origin) => origin.trim()),
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const token = getSessionTokenFromRequest(socket.request);
    const user = await getUserFromSession(token);
    if (!user) {
      socket.disconnect(true);
      return;
    }

    onlineUsers.set(user.id, { socketId: socket.id, userId: user.id, username: user.username });
    socket.join(`user:${user.id}`);
    io.emit("presence:update", { onlineUserIds: [...onlineUsers.keys()] });

    socket.on("chat:typing", ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
      socket.to(`chat:${conversationId}`).emit("chat:typing", {
        conversationId,
        userId: user.id,
        username: user.username,
        isTyping,
      });
    });

    socket.on("room:join", ({ roomSlug }: { roomSlug: string }) => {
      socket.join(`room:${roomSlug}`);
      io.to(`room:${roomSlug}`).emit("room:presence", {
        roomSlug,
        onlineUserIds: [...onlineUsers.keys()],
      });
    });

    socket.on("room:typing", ({ roomSlug, isTyping }: { roomSlug: string; isTyping: boolean }) => {
      socket.to(`room:${roomSlug}`).emit("room:typing", {
        roomSlug,
        userId: user.id,
        username: user.username,
        isTyping,
      });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(user.id);
      io.emit("presence:update", { onlineUserIds: [...onlineUsers.keys()] });
    });
  });

  return io;
}
