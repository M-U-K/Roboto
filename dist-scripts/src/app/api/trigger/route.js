"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const getTriggerInfo_1 = require("@/lib/service/public/getTriggerInfo");
async function GET() {
    try {
        const data = await (0, getTriggerInfo_1.getTriggerInfo)();
        return server_1.NextResponse.json(data);
    }
    catch (err) {
        console.error("Erreur /api/trigger", err);
        return new server_1.NextResponse("Erreur serveur", { status: 500 });
    }
}
