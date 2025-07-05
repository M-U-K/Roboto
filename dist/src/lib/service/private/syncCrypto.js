"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCrypto = syncCrypto;
// lib/private/syncCrypto.ts
const prisma_1 = require("@/lib/service/private/prisma");
const ticker_1 = require("@/lib/binance/public/ticker");
async function syncCrypto(symbol, referenceSymbol = "USDT") {
    if (symbol === referenceSymbol)
        return;
    const currentPrice = await (0, ticker_1.getCurrentPrice)(`${symbol}${referenceSymbol}`);
    if (!currentPrice || isNaN(currentPrice)) {
        throw new Error(`⚠️ Prix invalide pour ${symbol}`);
    }
    const wallet = await prisma_1.prisma.crypto.findUnique({ where: { symbol } });
    const holdings = (wallet === null || wallet === void 0 ? void 0 : wallet.totalHoldings) || 0;
    if (holdings < 2) {
        console.log(`⏩ ${symbol} ignoré (holdings < 2$)`);
        return;
    }
    const existing = wallet;
    if (existing) {
        let gainLoss = 0;
        if (existing.lastBuyPrice > 0) {
            gainLoss =
                ((currentPrice - existing.lastBuyPrice) / existing.lastBuyPrice) * 100;
        }
        console.log("🧪 UPDATE", {
            symbol,
            currentPrice,
            gainLossPct: gainLoss,
        });
        await prisma_1.prisma.crypto.update({
            where: { symbol },
            data: {
                currentPrice,
                gainLossPct: gainLoss,
            },
        });
    }
    else {
        await prisma_1.prisma.crypto.create({
            data: {
                symbol,
                totalHoldings: 0,
                lastBuyPrice: currentPrice,
                currentPrice,
                gainLossPct: 0,
                buyTrigger: 0,
                status: "pending-buy",
            },
        });
        console.log(`🆕 Crypto ajoutée : ${symbol}`);
    }
    console.log(`${symbol} synchronisé à ${currentPrice} ${referenceSymbol}`);
}
