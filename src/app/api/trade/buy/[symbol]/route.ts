import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const API_KEY = process.env.BINANCE_API_KEY!;
const PRIVATE_KEY_PATH = process.env.BINANCE_RSA_PRIVATE_PATH!;

function signQueryRSA(query: string) {
  const privateKey = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH), "utf8");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(query);
  sign.end();
  return sign.sign(privateKey, "base64");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(_req: Request, context: any) {
  const symbol = context.params.symbol.toUpperCase();

  if (symbol === "USDC") {
    return NextResponse.json(
      { error: "Impossible d'acheter USDC" },
      { status: 400 }
    );
  }

  const crypto = await prisma.crypto.findUnique({ where: { symbol } });
  const wallet = await prisma.wallet.findFirst();

  if (!crypto || !wallet) {
    return NextResponse.json(
      { error: "Crypto ou Wallet introuvable" },
      { status: 500 }
    );
  }
  const investment = crypto.pot;
  console.log("MONTANT INVESTIS =%d, %d", investment, crypto.totalHoldings);
  if (investment <= 0) {
    return NextResponse.json(
      { error: "Rien à acheter, déjà à 10 USDC ou plus." },
      { status: 400 }
    );
  }

  if (investment < 1) {
    return NextResponse.json(
      {
        error: `Montant trop faible pour Binance : ${investment.toFixed(
          2
        )} USDC`,
      },
      { status: 400 }
    );
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
    return NextResponse.json(
      { error: "Erreur Binance", detail: order },
      { status: 500 }
    );
  }

  const fills = order.fills || [];

  const totalQty = fills.reduce(
    (acc: number, f: any) => acc + parseFloat(f.qty),
    0
  );

  const avgPrice =
    fills.reduce(
      (acc: number, f: any) => acc + parseFloat(f.price) * parseFloat(f.qty),
      0
    ) / totalQty;

  const valueBought = totalQty * avgPrice;
  const newTotalHoldings = crypto.totalHoldings + valueBought;

  await prisma.crypto.update({
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

  await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      USDC: wallet.USDC - investment,
    },
  });

  await prisma.transaction.create({
    data: {
      fromSymbol: "USDC",
      toSymbol: symbol,
      amount: totalQty,
      priceAtTrade: avgPrice,
    },
  });

  await prisma.tradeEntry.create({
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

  return NextResponse.json({ success: true });
}
