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
const adjustBuyTrigger_1 = require("@/lib/service/private/adjustBuyTrigger");
const klines_1 = require("@/lib/binance/public/klines");
const API_KEY = process.env.BINANCE_API_KEY;
const PRIVATE_KEY_PATH = process.env.BINANCE_RSA_PRIVATE_PATH;
function signQueryRSA(query) {
    const privateKey = fs_1.default.readFileSync(path_1.default.resolve(PRIVATE_KEY_PATH), "utf8");
    const sign = crypto_1.default.createSign("RSA-SHA256");
    sign.update(query);
    sign.end();
    return sign.sign(privateKey, "base64");
}
function floorToStepSize(qty, stepSize) {
    var _a, _b;
    const precision = (_b = (_a = stepSize.toString().split(".")[1]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    const floored = Math.floor(qty / stepSize) * stepSize;
    return floored.toFixed(precision);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function POST(_req, context) {
    var _a, _b, _c, _d, _e;
    const symbol = (_b = (_a = context.params) === null || _a === void 0 ? void 0 : _a.symbol) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    if (!symbol) {
        return server_1.NextResponse.json({ error: "Symbol manquant" }, { status: 400 });
    }
    if (symbol === "USDC") {
        return server_1.NextResponse.json({ error: "Impossible de vendre USDC" }, { status: 400 });
    }
    const cryptoData = await prisma_1.prisma.crypto.findUnique({ where: { symbol } });
    if (!cryptoData || cryptoData.status !== "pending-sell") {
        return server_1.NextResponse.json({ error: "Crypto introuvable ou non vendable" }, { status: 400 });
    }
    const pair = `${symbol}USDC`;
    const infoRes = await fetch(`https://api.binance.com/api/v3/exchangeInfo?symbol=${pair}`);
    const infoData = await infoRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lotFilter = (_e = (_d = (_c = infoData.symbols) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filters) === null || _e === void 0 ? void 0 : _e.find((f) => f.filterType === "LOT_SIZE");
    const minQty = parseFloat((lotFilter === null || lotFilter === void 0 ? void 0 : lotFilter.minQty) || "0.00001");
    const stepSize = parseFloat((lotFilter === null || lotFilter === void 0 ? void 0 : lotFilter.stepSize) || "0.00001");
    const rawQty = cryptoData.totalHoldings / cryptoData.currentPrice;
    const quantity = parseFloat(floorToStepSize(rawQty, stepSize));
    if (quantity < minQty) {
        return server_1.NextResponse.json({
            error: `Quantité trop faible pour vendre. minQty = ${minQty}`,
            minQty,
        });
    }
    const timestamp = Date.now();
    const query = `symbol=${pair}&side=SELL&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = signQueryRSA(query);
    const url = `https://api.binance.com/api/v3/order?${query}&signature=${signature}`;
    console.log("📤 Requête envoyée à Binance :", { url });
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "X-MBX-APIKEY": API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const order = await res.json();
    if (!res.ok) {
        console.error("Erreur Binance :", order);
        return server_1.NextResponse.json({ error: "Erreur Binance", detail: order }, { status: 500 });
    }
    const fills = order.fills || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalQty = fills.reduce((acc, f) => acc + parseFloat(f.qty), 0);
    const totalRevenue = fills.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc, f) => acc + parseFloat(f.qty) * parseFloat(f.price), 0);
    const avgSellPrice = totalRevenue / totalQty;
    const gain = totalRevenue - cryptoData.pot;
    const reinvested = gain > 0 ? gain / 8 : 0;
    const secured = gain > 0 ? (gain * 6) / 8 : 0;
    const extracted = gain > 0 ? gain / 8 : 0;
    const newPot = gain > 0 ? cryptoData.pot + reinvested : cryptoData.pot;
    const wallet = await prisma_1.prisma.wallet.findFirst();
    if (!wallet) {
        return server_1.NextResponse.json({ error: "Wallet introuvable" }, { status: 500 });
    }
    const openTrade = await prisma_1.prisma.tradeEntry.findFirst({
        where: { cryptoId: cryptoData.id, sellPrice: 0 },
        orderBy: { dateBuy: "desc" },
    });
    if (openTrade) {
        const sellPrice = totalRevenue;
        const buyPrice = openTrade.buyPrice;
        const gainLoss = sellPrice - buyPrice;
        const gainLossPct = (gainLoss / buyPrice) * 100;
        const reinvested = gainLoss > 0 ? gainLoss / 8 : 0;
        const secured = gainLoss > 0 ? (gainLoss * 6) / 8 : 0;
        const extracted = gainLoss > 0 ? gainLoss / 8 : 0;
        await prisma_1.prisma.tradeEntry.update({
            where: { id: openTrade.id },
            data: {
                dateSell: new Date(),
                sellPrice,
                gainLoss,
                gainLossPct,
                reinvested,
                secured,
                extracted,
            },
        });
    }
    const klines = await (0, klines_1.getKlines)(symbol);
    await (0, adjustBuyTrigger_1.adjustBuyTrigger)(symbol, klines);
    await prisma_1.prisma.crypto.update({
        where: { symbol },
        data: {
            totalHoldings: 0,
            pot: newPot,
            sellAt: 0,
            lastSellPrice: avgSellPrice,
            lastSellDate: new Date(),
            status: "pending-buy",
            gainLossPct: 0,
        },
    });
    await prisma_1.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
            USDC: wallet.USDC + totalRevenue,
            cash: wallet.cash + extracted,
            security: wallet.security + secured,
        },
    });
    console.log("Crypto vendue :", {
        symbol,
        avgSellPrice,
        totalRevenue,
        gain,
        reinvested,
        secured,
        extracted,
        status: "pending-buy",
    });
    return server_1.NextResponse.json({ success: true, order });
}
