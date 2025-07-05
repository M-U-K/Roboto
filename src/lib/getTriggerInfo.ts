// lib/getTriggerInfo.ts
import { prisma } from "@/lib/prisma";

export async function getTriggerInfo() {
  // On ignore USDC
  const cryptos = await prisma.crypto.findMany({
    where: {
      symbol: {
        not: "USDC",
      },
    },
    select: {
      symbol: true,
      triggerScore: true,
      buyTrigger: true,
      volatility: true,
    },
    orderBy: { symbol: "asc" },
  });

  const highCount = cryptos.filter(
    (c) => c.triggerScore === c.buyTrigger - 1
  ).length;

  const volatility =
    cryptos.reduce((acc, c) => acc + (c.volatility ?? 1), 0) /
    (cryptos.length || 1);

  const log = await prisma.triggerLog.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    where: {
      symbol: {
        not: "USDC",
      },
    },
    select: {
      symbol: true,
      change: true,
      newScore: true,
    },
  });

  const formattedLog = log
    .slice(0, 5) // Prend les 5 premiers éléments du log (les plus récents)
    .map((entry) => ({
      symbol: entry.symbol,
      delta: entry.change,
      newScore: entry.newScore,
    }));

  return {
    volatility: Math.round(volatility),
    highCount,
    log: formattedLog,
  };
}
