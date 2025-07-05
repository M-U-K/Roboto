"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTriggerInfo = getTriggerInfo;
// lib/getTriggerInfo.ts
const prisma_1 = require("@/lib/service/private/prisma");
async function getTriggerInfo() {
    // On ignore USDC
    const cryptos = await prisma_1.prisma.crypto.findMany({
        where: {
            symbol: {
                not: "USDC",
            },
        },
        select: {
            symbol: true,
            triggerScore: true,
            buyTrigger: true,
            volatility: true,
        },
        orderBy: { symbol: "asc" },
    });
    const highCount = cryptos.filter((c) => c.triggerScore === c.buyTrigger - 1).length;
    const volatility = cryptos.reduce((acc, c) => { var _a; return acc + ((_a = c.volatility) !== null && _a !== void 0 ? _a : 1); }, 0) /
        (cryptos.length || 1);
    const log = await prisma_1.prisma.triggerLog.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        where: {
            symbol: {
                not: "USDC",
            },
        },
        select: {
            symbol: true,
            change: true,
            newScore: true,
        },
    });
    const formattedLog = log
        .slice(0, 5) // Prend les 5 premiers éléments du log (les plus récents)
        .map((entry) => ({
        symbol: entry.symbol,
        delta: entry.change,
        newScore: entry.newScore,
    }));
    return {
        volatility: Math.round(volatility),
        highCount,
        log: formattedLog,
    };
}
