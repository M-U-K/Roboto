"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTriggerScore = calculateTriggerScore;
// lib/calculateTriggerScore.ts
const prisma_1 = require("@/lib/service/private/prisma");
async function calculateTriggerScore(symbol, klines) {
    var _a;
    const crypto = await prisma_1.prisma.crypto.findUnique({ where: { symbol } });
    if (!crypto)
        throw new Error(`Crypto not found: ${symbol}`);
    let score = (_a = crypto.triggerScore) !== null && _a !== void 0 ? _a : 0;
    console.log(`\n--- 🧮 Calcul du triggerScore pour ${symbol} ---`);
    console.log(`🔢 Score initial : ${score}`);
    const closePrices = klines.map((k) => parseFloat(k[4]));
    const volumes = klines.map((k) => parseFloat(k[5]));
    const takerBuyVolumes = klines.map((k) => parseFloat(k[9]));
    const tradeCounts = klines.map((k) => parseFloat(k[8]));
    const currentPrice = closePrices[closePrices.length - 1];
    const lowest30d = Math.min(...closePrices);
    const change1d = (currentPrice - closePrices[closePrices.length - 2]) /
        closePrices[closePrices.length - 2];
    const change7d = (currentPrice - closePrices[closePrices.length - 8]) /
        closePrices[closePrices.length - 8];
    const change30d = (currentPrice - closePrices[0]) / closePrices[0];
    console.log(`💰 currentPrice : ${currentPrice}`);
    console.log(`📉 lowest30d : ${lowest30d}`);
    console.log(`📈 change1d : ${(change1d * 100).toFixed(2)}%`);
    console.log(`📈 change7d : ${(change7d * 100).toFixed(2)}%`);
    console.log(`📈 change30d : ${(change30d * 100).toFixed(2)}%`);
    // 📉 Prix en baisse sur 30j
    const palier30d = Math.floor(Math.abs(Math.min(change30d, 0)) / 0.05);
    if (palier30d > 0) {
        console.log(`✅ Prix -30j : +${palier30d}`);
        score += palier30d;
    }
    if (change7d <= -0.03) {
        console.log(`✅ -3% sur 7j : +1`);
        score += 1;
    }
    if (change1d <= -0.02) {
        console.log(`✅ -2% sur 1j : +1`);
        score += 1;
    }
    if (currentPrice < lowest30d) {
        console.log(`✅ Prix < plus bas 30j : +2`);
        score += 2;
    }
    if (Math.abs(change7d) <= 0.01) {
        console.log(`✅ Stagnation 7j : +1`);
        score += 1;
    }
    if (change7d >= 0.04) {
        console.log(`❌ Hausse > +4% sur 7j : -2`);
        score -= 2;
    }
    if (change1d >= 0.05) {
        console.log(`❌ Hausse brutale > +5% sur 1j : -3`);
        score -= 3;
    }
    // 🔇 Volume en baisse
    const avgVol7 = volumes.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const avgVolPrev7 = volumes.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    console.log(`📊 volume 7j : ${avgVol7.toFixed(2)}, précédent : ${avgVolPrev7.toFixed(2)}`);
    if (avgVol7 < avgVolPrev7) {
        console.log(`❌ Volume en baisse : -1`);
        score -= 1;
    }
    // ✅ Taker Buy Volume Ratio
    const sumTaker = takerBuyVolumes.reduce((a, b) => a + b, 0);
    const sumVol = volumes.reduce((a, b) => a + b, 0);
    const takerRatio = sumTaker / sumVol;
    console.log(`📊 Taker Buy Ratio : ${(takerRatio * 100).toFixed(1)}%`);
    if (takerRatio > 0.55) {
        console.log(`✅ Taker > 55% → +1`);
        score += 1;
    }
    if (takerRatio < 0.4) {
        console.log(`❌ Taker < 40% → -1`);
        score -= 1;
    }
    // 🔁 Nombre de trades
    const avgTrades7 = tradeCounts.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const avgTradesPrev7 = tradeCounts.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    console.log(`🔁 Trades 7j : ${avgTrades7.toFixed(0)}, précédent : ${avgTradesPrev7.toFixed(0)}`);
    if (avgTrades7 > avgTradesPrev7 * 1.2) {
        console.log(`✅ Activité en hausse → +1`);
        score += 1;
    }
    // 📉 Volatilité
    const meanPrice = closePrices.reduce((a, b) => a + b, 0) / closePrices.length;
    const stdDev = Math.sqrt(closePrices.reduce((acc, val) => acc + Math.pow(val - meanPrice, 2), 0) /
        closePrices.length);
    const volatilityPct = stdDev / meanPrice;
    console.log(`📉 Volatilité 30j : ${(volatilityPct * 100).toFixed(2)}%`);
    if (volatilityPct < 0.02 && avgVol7 > avgVolPrev7) {
        console.log(`✅ Compression silencieuse : +2`);
        score += 2;
    }
    if (volatilityPct > 0.06 && change7d < 0) {
        console.log(`❌ Volatilité > 6% + baisse 7j → -2`);
        score -= 2;
    }
    // 🚩 Pump & dump ?
    if (avgVol7 > avgVolPrev7 * 2 && change1d > 0.08) {
        console.log(`❌ Volume x2 + +8% en 1j → pump & dump → -3`);
        score -= 3;
    }
    // 📈 FOMO tardif
    if (change30d > 0.15) {
        console.log(`❌ +15% en 30j = FOMO tardif → -2`);
        score -= 2;
    }
    // 💤 Stagnation prolongée
    const stagnantDays = closePrices.filter((p) => Math.abs(p - currentPrice) / currentPrice < 0.01).length;
    if (stagnantDays >= 20) {
        console.log(`❌ Stagnation > 20 jours → -1`);
        score -= 1;
    }
    // 🔒 Clamp final
    const clampedScore = Math.max(-20, Math.min(15, score));
    if (clampedScore !== score) {
        console.log(`🔒 Clamp appliqué : triggerScore limité à ${clampedScore}`);
    }
    await prisma_1.prisma.crypto.update({
        where: { symbol },
        data: { triggerScore: clampedScore },
    });
    console.log(`🎯 Nouveau triggerScore : ${clampedScore}`);
    return clampedScore;
}
