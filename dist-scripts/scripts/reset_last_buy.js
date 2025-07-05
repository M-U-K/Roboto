"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function resetLastBuyToCurrent() {
    const allCryptos = await prisma.crypto.findMany();
    for (const crypto of allCryptos) {
        await prisma.crypto.update({
            where: { id: crypto.id },
            data: {
                lastBuyPrice: crypto.currentPrice,
            },
        });
        console.log(`🔄 ${crypto.symbol} - lastBuyPrice mis à jour: ${crypto.currentPrice}`);
    }
    console.log("Tous les lastBuyPrice ont été remis à jour.");
    await prisma.$disconnect();
}
resetLastBuyToCurrent().catch((e) => {
    console.error("Erreur lors du reset:", e);
    prisma.$disconnect();
    process.exit(1);
});
