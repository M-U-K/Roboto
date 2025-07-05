"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustBuyTrigger = adjustBuyTrigger;
// lib/adjustBuyTrigger.ts
const prisma_1 = require("@/lib/service/private/prisma");
async function adjustBuyTrigger(symbol, klines) {
    const volatilities = klines.map((k) => {
        const high = parseFloat(k[2]);
        const low = parseFloat(k[3]);
        const close = parseFloat(k[4]);
        return (high - low) / close;
    });
    const avgVolatility = volatilities.reduce((a, b) => a + b, 0) / volatilities.length;
    let palier = 1;
    if (avgVolatility < 0.01)
        palier = 5;
    else if (avgVolatility < 0.015)
        palier = 4;
    else if (avgVolatility < 0.025)
        palier = 3;
    else if (avgVolatility < 0.035)
        palier = 2;
    else
        palier = 1;
    // Tableau de buyTrigger selon le palier (sécurité ignorée ici, à gérer ailleurs)
    const buyTriggers = {
        1: 15,
        2: 10,
        3: 6,
        4: 5,
        5: 4,
    };
    await prisma_1.prisma.crypto.update({
        where: { symbol },
        data: {
            buyTrigger: buyTriggers[palier],
            volatility: palier,
        },
    });
}
