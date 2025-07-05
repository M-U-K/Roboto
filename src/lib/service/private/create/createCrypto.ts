import { prisma } from "@/lib/service/private/core/prisma";

export async function createCrypto(
  symbol: string,
  currentPrice: number,
  totalHoldings = 0
) {
  return prisma.crypto.create({
    data: {
      symbol,
      totalHoldings,
      lastBuyPrice: currentPrice,
      currentPrice,
      gainLossPct: 0,
      buyTrigger: 0,
      status: "pending-buy",
    },
  });
}
