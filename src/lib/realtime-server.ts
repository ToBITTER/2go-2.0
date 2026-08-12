type MessageSender = {
  id: string;
  username: string;
  displayName: string;
  rank: string;
  picture: string | null;
};

type SocketLike = {
  to: (room: string) => {
    emit: (event: string, payload: unknown) => void;
  };
  emit: (event: string, payload: unknown) => void;
};

type RealtimeServer = {
  io: SocketLike;
};

let server: RealtimeServer | null = null;

export function setRealtimeServer(io: SocketLike) {
  server = { io };
}

export function emitChatTyping(payload: { conversationId: string; userId: string; username: string; isTyping: boolean }) {
  server?.io.to(`chat:${payload.conversationId}`).emit("chat:typing", payload);
}

export function emitRoomTyping(payload: { roomSlug: string; userId: string; username: string; isTyping: boolean }) {
  server?.io.to(`room:${payload.roomSlug}`).emit("room:typing", payload);
}

export function emitRoomPresence(payload: { roomSlug: string; onlineUserIds: string[] }) {
  server?.io.to(`room:${payload.roomSlug}`).emit("room:presence", payload);
}

export function emitConversationMessage(payload: {
  conversationId: string;
  message: {
    id: string;
    body: string;
    createdAt: string;
    sender: MessageSender;
  };
}) {
  server?.io.to(`chat:${payload.conversationId}`).emit("chat:message", payload);
}

export function emitRoomMessage(payload: {
  roomSlug: string;
  message: {
    id: string;
    body: string;
    createdAt: string;
    sender: MessageSender;
  };
}) {
  server?.io.to(`room:${payload.roomSlug}`).emit("room:message", payload);
}
