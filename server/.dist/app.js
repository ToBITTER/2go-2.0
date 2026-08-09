"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const health_js_1 = require("./routes/health.js");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)("dev"));
    app.get("/", (_, res) => {
        res.json({
            name: "2go 2.0 API",
            status: "ok",
            message: "Phase 0 backend foundation is live.",
        });
    });
    app.use("/health", health_js_1.healthRouter);
    app.use((_, res) => {
        res.status(404).json({ error: "Not found" });
    });
    return app;
}
