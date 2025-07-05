"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActiveCryptosFromWallet = updateActiveCryptosFromWallet;
// lib/updateActiveCryptosFromWallet.ts
const prisma_1 = require("@/lib/service/private/prisma");
const account_1 = require("@/lib/binance/private/account");
const ticker_1 = require("@/lib/binance/public/ticker");
async function updateActiveCryptosFromWallet() {
    const activeCryptos = await (0, account_1.getWalletBalances)();
    const kept = [];
    for (const { symbol, amount } of activeCryptos) {
        const currentPrice = await (0, ticker_1.getCurrentPrice)(`${symbol}USDC`);
        if (!currentPrice)
            continue;
        const totalValue = amount * currentPrice;
        if (totalValue < 2) {
            console.log(`⏩ ${symbol} ignoré (valeur totale < 2$)`);
            continue;
        }
        const exists = await prisma_1.prisma.crypto.findUnique({ where: { symbol } });
        if (!exists) {
            await prisma_1.prisma.crypto.create({
                data: {
                    symbol,
                    totalHoldings: totalValue,
                    lastBuyPrice: currentPrice,
                    currentPrice,
                    gainLossPct: 0,
                    buyTrigger: 0,
                    status: "pending-buy",
                },
            });
            console.log(`🆕 Crypto ajoutée : ${symbol}`);
        }
        else {
            console.log(`🔁 Crypto déjà en base : ${symbol}`);
        }
        kept.push(symbol);
    }
    return kept;
}
