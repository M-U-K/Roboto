import { prisma } from "@/lib/service/private/core/prisma";
import { getKlines } from "@/lib/binance/public/klines";
import { adjustBuyTrigger } from "../adjustBuyTrigger";

export async function pendingBuy(params: {
  symbol: string;
  avgSellPrice: number;
  totalRevenue: number;
  extracted: number;
  secured: number;
  reinvested: number;
}) {
  const { symbol, avgSellPrice, totalRevenue, extracted, secured, reinvested } =
    params;

  const crypto = await prisma.crypto.findUnique({ where: { symbol } });
  if (!crypto) throw new Error("Crypto introuvable");

  const wallet = await prisma.wallet.findFirst();
  const state = await prisma.state.findFirst();

  if (!wallet || !state) throw new Error("Wallet ou State introuvable");

  const newPot = crypto.pot + reinvested;

  const klines = await getKlines(symbol);
  await adjustBuyTrigger(symbol, klines);

  await prisma.crypto.update({
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

  await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      USDC: wallet.USDC + totalRevenue,
      cash: wallet.cash + extracted,
      security: wallet.security + secured,
    },
  });

  await prisma.state.update({
    where: { id: state.id },
    data: {
      totalGain: state.totalGain + extracted,
    },
  });

  return newPot;
}
