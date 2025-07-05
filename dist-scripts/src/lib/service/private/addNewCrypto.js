"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewCrypto = addNewCrypto;
const prisma_1 = require("@/lib/service/private/prisma");
const klines_1 = require("@/lib/binance/public/klines");
const adjustBuyTrigger_1 = require("@/lib/service/private/adjustBuyTrigger");
async function getUSDCConvertibleSymbols() {
    const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    if (!res.ok)
        return [];
    const data = await res.json();
    const symbols = data.symbols;
    // Ne garder que les cryptos échangeables contre USDC
    const usdcPairs = symbols.filter((s) => s.quoteAsset === "USDC");
    const baseAssets = usdcPairs.map((s) => s.baseAsset);
    return [...new Set(baseAssets)];
}
async function addNewCrypto() {
    // Récupère la valeur de sécurité et du pot total
    const wallet = await prisma_1.prisma.wallet.findFirst();
    if (!wallet)
        throw new Error("Wallet non trouvé");
    const { security } = wallet;
    if (security < 11) {
        console.log("🔒 Pas assez de sécurité pour ajouter une crypto");
        return null;
    }
    // Récupère les cryptos déjà présentes
    const existing = await prisma_1.prisma.crypto.findMany({ select: { symbol: true } });
    const existingSymbols = existing.map((e) => e.symbol);
    // Cherche toutes les cryptos échangeables contre USDC
    const candidates = (await getUSDCConvertibleSymbols()).filter((s) => !existingSymbols.includes(s));
    for (const symbol of candidates) {
        const klines = await (0, klines_1.getKlines)(symbol);
        await (0, adjustBuyTrigger_1.adjustBuyTrigger)(symbol, klines);
        // Ajout de la nouvelle crypto
        const newCrypto = await prisma_1.prisma.crypto.create({
            data: {
                symbol,
                status: "pending-buy",
                buyTrigger: 0,
                volatility: 0,
                totalHoldings: 0,
                lastBuyPrice: 0,
                currentPrice: 0,
                gainLossPct: 0,
                pot: 10,
                sellAt: 0,
                lastSellDate: null,
                lastSellPrice: 0,
            },
        });
        // Réduction de la sécurité dans le wallet
        await prisma_1.prisma.wallet.update({
            where: { id: wallet.id },
            data: { security: { decrement: 10 } },
        });
        console.log(`🆕 Crypto ajoutée : ${symbol}`);
        return newCrypto;
    }
    console.log("🚫 Aucune nouvelle crypto USDC à ajouter");
    return null;
}
