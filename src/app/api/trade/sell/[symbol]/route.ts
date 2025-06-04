import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
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

function floorToStepSize(qty: number, stepSize: number): string {
  const precision = stepSize.toString().split(".")[1]?.length ?? 0;
  const floored = Math.floor(qty / stepSize) * stepSize;
  return floored.toFixed(precision);
}

export async function POST(
  _req: Request,
  context: { params?: { symbol?: string } }
) {
  const symbol = context.params?.symbol?.toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: "Symbol manquant" }, { status: 400 });
  }

  if (symbol === "USDC") {
    return NextResponse.json(
      { error: "Impossible de vendre USDC" },
      { status: 400 }
    );
  }

  const cryptoData = await prisma.crypto.findUnique({ where: { symbol } });

  if (!cryptoData || cryptoData.status !== "pending-sell") {
    return NextResponse.json(
      { error: "Crypto introuvable ou non vendable" },
      { status: 400 }
    );
  }

  const pair = `${symbol}USDC`;

  const infoRes = await fetch(
    `https://api.binance.com/api/v3/exchangeInfo?symbol=${pair}`
  );
  const infoData = await infoRes.json();

  const lotFilter = infoData.symbols?.[0]?.filters?.find(
    (f: any) => f.filterType === "LOT_SIZE"
  );
  const minQty = parseFloat(lotFilter?.minQty || "0.00001");
  const stepSize = parseFloat(lotFilter?.stepSize || "0.00001");
  const maxQty = parseFloat(lotFilter?.maxQty || "999999");

  const rawQty = cryptoData.totalHoldings / cryptoData.currentPrice;
  const quantity = parseFloat(floorToStepSize(rawQty, stepSize));

  if (quantity < minQty) {
    return NextResponse.json({
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
  const totalRevenue = fills.reduce(
    (acc: number, f: any) => acc + parseFloat(f.qty) * parseFloat(f.price),
    0
  );
  const avgSellPrice = totalRevenue / totalQty;
  const gain = totalRevenue - cryptoData.pot;

  const reinvested = gain > 0 ? gain / 8 : 0;
  const secured = gain > 0 ? (gain * 6) / 8 : 0;
  const extracted = gain > 0 ? gain / 8 : 0;

  const wallet = await prisma.wallet.findFirst();
  if (!wallet) {
    return NextResponse.json({ error: "Wallet introuvable" }, { status: 500 });
  }

  const openTrade = await prisma.tradeEntry.findFirst({
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

    await prisma.tradeEntry.update({
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

  await prisma.crypto.update({
    where: { symbol },
    data: {
      totalHoldings: 0,
      pot: 0,
      sellAt: null,
      lastSellPrice: avgSellPrice,
      lastSellDate: new Date(),
      status: "pending-buy",
    },
  });

  await prisma.wallet.update({
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

  return NextResponse.json({ success: true, order });
}
