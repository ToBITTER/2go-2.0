"use client";

import { io, type Socket } from "socket.io-client";

type ServerEvents = {
  "presence:update": (payload: { onlineUserIds: string[] }) => void;
  "chat:typing": (payload: { conversationId: string; userId: string; username: string; isTyping: boolean }) => void;
  "room:typing": (payload: { roomSlug: string; userId: string; username: string; isTyping: boolean }) => void;
  "room:presence": (payload: { roomSlug: string; onlineUserIds: string[] }) => void;
};

type ClientEvents = {
  "chat:typing": (payload: { conversationId: string; isTyping: boolean }) => void;
  "room:join": (payload: { roomSlug: string }) => void;
  "room:typing": (payload: { roomSlug: string; isTyping: boolean }) => void;
};

let socket: Socket<ServerEvents, ClientEvents> | null = null;

function getSocketUrl() {
  return process.env.NEXT_PUBLIC_SOCKET_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
}

export function getSocket() {
  if (typeof window === "undefined") return null;
  if (!socket) {
    socket = io(getSocketUrl(), {
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return socket;
}
