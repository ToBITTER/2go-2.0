"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_js_1 = require("./app.js");
const socket_js_1 = require("./socket.js");
const port = Number(process.env.PORT ?? 4000);
const app = (0, app_js_1.createApp)();
const server = (0, http_1.createServer)(app);
(0, socket_js_1.attachSocketServer)(server);
server.listen(port, () => {
    console.log(`2go API listening on http://localhost:${port}`);
});
