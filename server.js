const http = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  await app.prepare();

  const server = http.createServer((req, res) => {
    void handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: (process.env.CLIENT_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("chat:typing", ({ conversationId, isTyping }) => {
      socket.to(`chat:${conversationId}`).emit("chat:typing", {
        conversationId,
        userId: socket.id,
        username: "Someone",
        isTyping,
      });
    });

    socket.on("room:join", ({ roomSlug }) => {
      socket.join(`room:${roomSlug}`);
      io.to(`room:${roomSlug}`).emit("room:presence", {
        roomSlug,
        onlineUserIds: [],
      });
    });

    socket.on("room:typing", ({ roomSlug, isTyping }) => {
      socket.to(`room:${roomSlug}`).emit("room:typing", {
        roomSlug,
        userId: socket.id,
        username: "Someone",
        isTyping,
      });
    });
  });

  server.listen(port, hostname, () => {
    console.log(`2go 2.0 running on http://${hostname}:${port}`);
  });
}

void main();
