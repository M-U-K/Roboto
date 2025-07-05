import { prisma } from "@/lib/service/private/core/prisma";
import { placeMarketBuyOrder } from "@/lib/binance/private/placeMarketBuyOrder";

export async function buyCrypto(symbol: string) {
  const crypto = await prisma.crypto.findUnique({ where: { symbol } });
  const wallet = await prisma.wallet.findFirst();
  if (!crypto || !wallet) throw new Error("Crypto ou Wallet introuvable");

  const investment = crypto.pot;
  if (investment <= 0) throw new Error("Rien à acheter, pot vide.");
  if (investment < 1) {
    throw new Error(
      `Montant trop faible pour Binance : ${investment.toFixed(2)} USDC`
    );
  }

  // 🔁 Appel purifié
  const { totalQty, avgPrice, valueBought } = await placeMarketBuyOrder(
    symbol,
    investment
  );

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

  return {
    success: true,
    symbol,
    totalQty,
    avgPrice,
    valueBought,
  };
}
