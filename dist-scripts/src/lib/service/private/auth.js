"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = verifyAuth;
function verifyAuth(req) {
    const secret = req.headers.get("x-secret");
    return secret === process.env.API_SECRET;
}
