"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function resetAllStatuses() {
    const allCryptos = await prisma.crypto.findMany();
    for (const crypto of allCryptos) {
        await prisma.crypto.update({
            where: { id: crypto.id },
            data: { status: "pending-buy" },
        });
        console.log(`🔄 ${crypto.symbol} → status = pending-buy`);
    }
    console.log("Tous les statuts ont été remis à 'pending-buy'.");
    await prisma.$disconnect();
}
resetAllStatuses().catch((err) => {
    console.error("Erreur lors du reset des statuts :", err);
    prisma.$disconnect();
    process.exit(1);
});
