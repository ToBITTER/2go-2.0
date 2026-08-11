import { createServer } from "http";
import { createApp } from "./app.js";
import { attachSocketServer } from "./socket.js";

const port = Number(process.env.PORT ?? 4000);

const app = createApp();
const server = createServer(app);
attachSocketServer(server);

server.listen(port, () => {
  console.log(`2go API listening on http://localhost:${port}`);
});
