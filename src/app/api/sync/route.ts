import { NextResponse } from "next/server";
import { updateActiveCryptosFromWallet } from "../../../lib/updateFromBinance";
import { syncCrypto } from "../../../lib/syncCrypto";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function GET() {
  try {
    const active = await updateActiveCryptosFromWallet();

    for (const symbol of active) {
      await syncCrypto(symbol);
    }
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const privateKeyPath = process.env.BINANCE_RSA_PRIVATE_PATH!;
    const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(query);
    sign.end();
    const signature = sign.sign(privateKey, "base64");

    const res = await fetch(
      `https://api.binance.com/api/v3/account?${query}&signature=${signature}`,
      {
        headers: {
          "X-MBX-APIKEY": process.env.BINANCE_API_KEY!,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Erreur Binance API: ${errorBody}`);
    }

    const data = await res.json();
    const balances = data.balances as { asset: string; free: string }[];

    for (const { asset, free } of balances) {
      const amount = parseFloat(free);
      if (amount > 0 && asset !== "USDT") {
        const crypto = await prisma.crypto.findUnique({
          where: { symbol: asset },
        });
        if (crypto && crypto.currentPrice) {
          const valueInDollars = amount * crypto.currentPrice;
          await prisma.crypto.update({
            where: { symbol: asset },
            data: { totalHoldings: valueInDollars },
          });
        }
      }
    }

    const allCryptos = await prisma.crypto.findMany({
      orderBy: { symbol: "asc" },
    });

    return NextResponse.json(allCryptos);
  } catch (error) {
    console.error("Erreur dans /api/sync", error);
    return NextResponse.json([]);
  }
}
