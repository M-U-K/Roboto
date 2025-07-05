"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = require("@/lib/service/private/prisma");
const updateState_1 = require("@/lib/service/private/updateState");
async function GET() {
    try {
        let state = await prisma_1.prisma.state.findUnique({ where: { id: 1 } });
        if (!state) {
            await (0, updateState_1.updateState)();
            state = await prisma_1.prisma.state.findUnique({ where: { id: 1 } });
        }
        if (!state) {
            return server_1.NextResponse.json({ error: "État introuvable même après tentative de création." }, { status: 404 });
        }
        return server_1.NextResponse.json(state);
    }
    catch (error) {
        console.error("Erreur lecture état global :", error);
        return server_1.NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
