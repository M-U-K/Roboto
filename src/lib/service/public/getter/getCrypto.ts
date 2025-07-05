// lib/service/public/getCryptoList.ts
import { prisma } from "@/lib/service/private/core/prisma";

export async function getCryptoList() {
  const cryptos = await prisma.crypto.findMany({
    orderBy: { totalHoldings: "desc" },
    select: {
      symbol: true,
      totalHoldings: true,
      pot: true,
      gainLossPct: true,
      currentPrice: true,
      lastBuyPrice: true,
      lastSellPrice: true,
      sellAt: true,
      buyTrigger: true,
      triggerScore: true,
      status: true,
    },
  });

  return cryptos;
}
