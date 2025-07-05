import { prisma } from "@/lib/service/private/core/prisma";
import { calculateTriggerScore } from "@/lib/service/private/triggers/calculateTriggerScore";
import { adjustBuyTrigger } from "@/lib/service/private/triggers/adjustBuyTrigger";
import { getKlines } from "@/lib/binance/public/klines";
import { logTriggerChange } from "@/lib/service/public/log/createTriggerLog";

export async function updateTriggers() {
  const inactiveCryptos = await prisma.crypto.findMany({
    where: {
      status: "pending-buy",
      NOT: { symbol: "USDC" },
    },
  });

  for (const crypto of inactiveCryptos) {
    try {
      const klines = await getKlines(crypto.symbol);

      await adjustBuyTrigger(crypto.symbol, klines);
      const oldScore = crypto.triggerScore;
      const newScore = await calculateTriggerScore(crypto.symbol, klines);

      if (oldScore !== newScore) {
        await logTriggerChange(crypto.symbol, oldScore, newScore);
      }

      await prisma.crypto.update({
        where: { symbol: crypto.symbol },
        data: { triggerScore: newScore },
      });

      if (newScore >= crypto.buyTrigger && crypto.buyTrigger > 0) {
        await fetch(`${process.env.BASE_URL}/api/trade/buy/${crypto.symbol}`, {
          method: "POST",
        });
      }
    } catch (err) {
      console.error(`Erreur trigger ${crypto.symbol}`, err);
    }
  }
}
