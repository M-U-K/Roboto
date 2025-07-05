"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKlines = getKlines;
// lib/getKlines.ts
async function getKlines(symbol) {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=30`);
    if (!res.ok) {
        throw new Error(`Erreur API Binance pour ${symbol}: ${res.statusText}`);
    }
    const klines = await res.json();
    return klines; // chaque élément : [openTime, open, high, low, close, volume, ...]
}
