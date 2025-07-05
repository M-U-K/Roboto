"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const prisma_1 = require("@/lib/service/private/prisma");
const server_1 = require("next/server");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function GET(req, context) {
    const { symbol } = context.params;
    try {
        const crypto = await prisma_1.prisma.crypto.findUnique({
            where: { symbol },
            include: { trades: true },
        });
        if (!crypto) {
            return server_1.NextResponse.json({ error: "Crypto non trouvée" }, { status: 404 });
        }
        return server_1.NextResponse.json(crypto.trades);
    }
    catch (error) {
        console.error("Erreur dans GET /api/crypto/[symbol]/trades :", error);
        return server_1.NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
