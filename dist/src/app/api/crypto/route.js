"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const prisma_1 = require("@/lib/service/private/prisma");
const server_1 = require("next/server");
async function GET() {
    try {
        const cryptos = await prisma_1.prisma.crypto.findMany({
            orderBy: { symbol: "asc" },
        });
        return server_1.NextResponse.json(cryptos);
    }
    catch (err) {
        console.error("Erreur GET /crypto :", err);
        return server_1.NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
