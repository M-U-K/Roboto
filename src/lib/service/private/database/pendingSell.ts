import { prisma } from "@/lib/service/private/core/prisma";

export async function pendingSell(params: {
  symbol: string;
  valueBought: number;
  avgPrice: number;
}) {
  const { symbol, valueBought, avgPrice } = params;

  const crypto = await prisma.crypto.findUnique({ where: { symbol } });
  if (!crypto) throw new Error("Crypto introuvable");

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

  return newTotalHoldings;
}
