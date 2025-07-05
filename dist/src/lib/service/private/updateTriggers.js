"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTriggers = updateTriggers;
const prisma_1 = require("@/lib/service/private/prisma");
const calculateTriggerScore_1 = require("@/lib/service/private/calculateTriggerScore");
const adjustBuyTrigger_1 = require("@/lib/service/private/adjustBuyTrigger");
const klines_1 = require("@/lib/binance/public/klines");
const createTriggerLog_1 = require("@/lib/service/public/createTriggerLog");
async function updateTriggers() {
    const inactiveCryptos = await prisma_1.prisma.crypto.findMany({
        where: {
            status: "pending-buy",
            NOT: { symbol: "USDC" },
        },
    });
    for (const crypto of inactiveCryptos) {
        try {
            const klines = await (0, klines_1.getKlines)(crypto.symbol);
            await (0, adjustBuyTrigger_1.adjustBuyTrigger)(crypto.symbol, klines);
            const oldScore = crypto.triggerScore;
            const newScore = await (0, calculateTriggerScore_1.calculateTriggerScore)(crypto.symbol, klines);
            if (oldScore !== newScore) {
                await (0, createTriggerLog_1.logTriggerChange)(crypto.symbol, oldScore, newScore);
            }
            await prisma_1.prisma.crypto.update({
                where: { symbol: crypto.symbol },
                data: { triggerScore: newScore },
            });
            if (newScore >= crypto.buyTrigger && crypto.buyTrigger > 0) {
                await fetch(`${process.env.BASE_URL}/api/trade/buy/${crypto.symbol}`, {
                    method: "POST",
                });
            }
        }
        catch (err) {
            console.error(`Erreur trigger ${crypto.symbol}`, err);
        }
    }
}
