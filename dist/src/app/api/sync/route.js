"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const updateFromBinance_1 = require("@/lib/service/private/updateFromBinance");
const syncCrypto_1 = require("@/lib/service/private/syncCrypto");
const checkAutoSell_1 = require("@/lib/service/private/checkAutoSell");
const checkAndAddCrypto_1 = require("@/lib/service/private/checkAndAddCrypto");
const account_1 = require("@/lib/binance/private/account");
const prisma_1 = require("@/lib/service/private/prisma");
async function GET() {
    try {
        const active = await (0, updateFromBinance_1.updateActiveCryptosFromWallet)();
        for (const symbol of active) {
            await (0, syncCrypto_1.syncCrypto)(symbol);
            await (0, checkAutoSell_1.checkAutoSell)(symbol);
            await (0, checkAndAddCrypto_1.checkAndAddCrypto)();
        }
        const data = await (0, account_1.getAccountInfo)();
        const balances = data.balances;
        for (const { asset, free } of balances) {
            const amount = parseFloat(free);
            if (amount > 0 && asset !== "USDT") {
                const crypto = await prisma_1.prisma.crypto.findUnique({
                    where: { symbol: asset },
                });
                if (crypto && crypto.currentPrice) {
                    const valueInDollars = amount * crypto.currentPrice;
                    await prisma_1.prisma.crypto.update({
                        where: { symbol: asset },
                        data: { totalHoldings: valueInDollars },
                    });
                }
            }
        }
        const allCryptos = await prisma_1.prisma.crypto.findMany({
            orderBy: { symbol: "asc" },
        });
        return server_1.NextResponse.json(allCryptos);
    }
    catch (error) {
        console.error("Erreur dans /api/sync", error);
        return server_1.NextResponse.json([]);
    }
}
