"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const updateTriggers_1 = require("@/lib/service/private/updateTriggers");
async function POST() {
    try {
        await (0, updateTriggers_1.updateTriggers)();
        return server_1.NextResponse.json({ success: true });
    }
    catch (err) {
        console.error("[API] ❌ Erreur dans updateTriggers :", err);
        return server_1.NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}
