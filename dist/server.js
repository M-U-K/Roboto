"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const next_1 = __importDefault(require("next"));
const http_1 = __importDefault(require("http"));
const cron_1 = require("@/lib/service/private/cron");
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    (0, cron_1.startCronJobs)();
    console.log("✅ Cron lancé.");
    const server = http_1.default.createServer((req, res) => {
        handle(req, res);
    });
    server.listen(port, () => {
        console.log(`🚀 Serveur Next.js en écoute sur http://localhost:${port}`);
    });
});
