"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPrice = getCurrentPrice;
// lib/binance/public/ticker.ts
async function getCurrentPrice(pair) {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`Erreur Binance ticker pour ${pair}: ${res.statusText}`);
        return null;
    }
    const data = await res.json();
    return parseFloat(data.price);
}
