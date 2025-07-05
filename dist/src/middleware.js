"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
// middleware.ts
const server_1 = require("next/server");
function middleware(_req) {
    return server_1.NextResponse.next();
}
