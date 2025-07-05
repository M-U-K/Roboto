"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateState = updateState;
const prisma_1 = require("@/lib/service/private/prisma");
async function updateState() {
    const cryptos = await prisma_1.prisma.crypto.findMany();
    const nbrCrypto = cryptos.length;
    const activeCryptos = cryptos.filter((c) => c.status === "pending-sell");
    const nbrCryptoOn = activeCryptos.filter((c) => c.gainLossPct > 0).length;
    const nbrCryptoOff = activeCryptos.filter((c) => c.gainLossPct < 0).length;
    await prisma_1.prisma.state.upsert({
        where: { id: 1 },
        update: {
            isActive: 1,
            nbrCrypto,
            nbrCryptoOn,
            nbrCryptoOff,
        },
        create: {
            id: 1,
            isActive: 1,
            nbrCrypto,
            nbrCryptoOn,
            nbrCryptoOff,
            totalGain: 0,
        },
    });
    console.log("📊 État global mis à jour.");
}
