import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

const API_KEY = process.env.BINANCE_API_KEY!;
const PRIVATE_KEY_PATH = process.env.BINANCE_RSA_PRIVATE_PATH!;

function signQueryRSA(query: string) {
  const privateKey = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH), "utf8");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(query);
  sign.end();
  return sign.sign(privateKey, "base64");
}

async function getWalletBalances(): Promise<
  { symbol: string; amount: number }[]
> {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = signQueryRSA(query);

  const url = `https://api.binance.com/api/v3/account?${query}&signature=${signature}`;
  const res = await fetch(url, {
    headers: {
      "X-MBX-APIKEY": API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur Binance: ${await res.text()}`);
  }

  const data = await res.json();
  const balances = data.balances as { asset: string; free: string }[];

  const activeCryptos = balances
    .map((b) => ({ symbol: b.asset, amount: parseFloat(b.free) }))
    .filter((b) => b.amount > 0);

  return activeCryptos;
}

export async function updateActiveCryptosFromWallet() {
  const activeCryptos = await getWalletBalances();
  const kept: string[] = [];

  for (const { symbol, amount } of activeCryptos) {
    const priceRes = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
    );

    if (!priceRes.ok) continue;

    const { price } = await priceRes.json();
    const currentPrice = parseFloat(price);
    const totalValue = amount * currentPrice;

    if (totalValue < 2) {
      console.log(`⏩ ${symbol} ignoré (valeur totale < 2$)`);
      continue;
    }

    const exists = await prisma.crypto.findUnique({ where: { symbol } });

    if (!exists) {
      await prisma.crypto.create({
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
    } else {
      console.log(`🔁 Crypto déjà en base : ${symbol}`);
    }

    kept.push(symbol);
  }

  return kept;
}
