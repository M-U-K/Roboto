"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const prisma_1 = require("@/lib/service/private/prisma");
const server_1 = require("next/server");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const API_KEY = process.env.BINANCE_API_KEY;
const PRIVATE_KEY_PATH = process.env.BINANCE_RSA_PRIVATE_PATH;
function signQueryRSA(query) {
    const privateKey = fs_1.default.readFileSync(path_1.default.resolve(PRIVATE_KEY_PATH), "utf8");
    const sign = crypto_1.default.createSign("RSA-SHA256");
    sign.update(query);
    sign.end();
    return sign.sign(privateKey, "base64");
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function POST(_req, context) {
    const symbol = context.params.symbol.toUpperCase();
    if (symbol === "USDC") {
        return server_1.NextResponse.json({ error: "Impossible d'acheter USDC" }, { status: 400 });
    }
    const crypto = await prisma_1.prisma.crypto.findUnique({ where: { symbol } });
    const wallet = await prisma_1.prisma.wallet.findFirst();
    if (!crypto || !wallet) {
        return server_1.NextResponse.json({ error: "Crypto ou Wallet introuvable" }, { status: 500 });
    }
    const investment = crypto.pot;
    console.log("MONTANT INVESTIS =%d, %d", investment, crypto.totalHoldings);
    if (investment <= 0) {
        return server_1.NextResponse.json({ error: "Rien à acheter, déjà à 10 USDC ou plus." }, { status: 400 });
    }
    if (investment < 1) {
        return server_1.NextResponse.json({
            error: `Montant trop faible pour Binance : ${investment.toFixed(2)} USDC`,
        }, { status: 400 });
    }
    const pair = `${symbol}USDC`;
    const timestamp = Date.now();
    const query = `symbol=${pair}&side=BUY&type=MARKET&quoteOrderQty=${investment}&timestamp=${timestamp}`;
    const signature = signQueryRSA(query);
    const url = `https://api.binance.com/api/v3/order?${query}&signature=${signature}`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "X-MBX-APIKEY": API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const order = await res.json();
    if (!res.ok) {
        console.error("Binance error:", order);
        return server_1.NextResponse.json({ error: "Erreur Binance", detail: order }, { status: 500 });
    }
    const fills = order.fills || [];
    const totalQty = fills.reduce((acc, f) => acc + parseFloat(f.qty), 0);
    const avgPrice = fills.reduce((acc, f) => acc + parseFloat(f.price) * parseFloat(f.qty), 0) / totalQty;
    const valueBought = totalQty * avgPrice;
    const newTotalHoldings = crypto.totalHoldings + valueBought;
    await prisma_1.prisma.crypto.update({
        where: { symbol },
        data: {
            totalHoldings: newTotalHoldings,
            lastBuyPrice: avgPrice,
            currentPrice: avgPrice,
            triggerScore: 0,
            buyTrigger: 0,
            status: "pending-sell",
            sellAt: newTotalHoldings * 1.05,
        },
    });
    await prisma_1.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
            USDC: wallet.USDC - investment,
        },
    });
    await prisma_1.prisma.transaction.create({
        data: {
            fromSymbol: "USDC",
            toSymbol: symbol,
            amount: totalQty,
            priceAtTrade: avgPrice,
        },
    });
    await prisma_1.prisma.tradeEntry.create({
        data: {
            cryptoId: crypto.id,
            dateBuy: new Date(),
            dateSell: null,
            buyPrice: valueBought,
            sellPrice: 0,
            gainLoss: 0,
            gainLossPct: 0,
            reinvested: 0,
            secured: 0,
            extracted: 0,
        },
    });
    return server_1.NextResponse.json({ success: true });
}
