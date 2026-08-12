let server = null;

function setRealtimeServer(io) {
  server = { io };
}

function emitChatTyping(payload) {
  server?.io.to(`chat:${payload.conversationId}`).emit("chat:typing", payload);
}

function emitRoomTyping(payload) {
  server?.io.to(`room:${payload.roomSlug}`).emit("room:typing", payload);
}

function emitRoomPresence(payload) {
  server?.io.to(`room:${payload.roomSlug}`).emit("room:presence", payload);
}

function emitConversationMessage(payload) {
  server?.io.to(`chat:${payload.conversationId}`).emit("chat:message", payload);
}

function emitRoomMessage(payload) {
  server?.io.to(`room:${payload.roomSlug}`).emit("room:message", payload);
}

module.exports = {
  setRealtimeServer,
  emitChatTyping,
  emitRoomTyping,
  emitRoomPresence,
  emitConversationMessage,
  emitRoomMessage,
};
