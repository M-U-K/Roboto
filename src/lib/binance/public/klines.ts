// lib/getKlines.ts
export async function getKlines(symbol: string): Promise<any[]> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}USDC&interval=1d&limit=30`
  );

  if (!res.ok) {
    throw new Error(`Erreur API Binance pour ${symbol}: ${res.statusText}`);
  }

  const klines = await res.json();
  return klines; // chaque élément : [openTime, open, high, low, close, volume, ...]
}
