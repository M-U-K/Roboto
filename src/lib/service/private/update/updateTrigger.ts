import { prisma } from "@/lib/service/private/core/prisma";
import { getKlines } from "@/lib/binance/public/klines";
import { adjustBuyTrigger } from "@/lib/service/private/adjustBuyTrigger";
import { calculateTriggerScore } from "@/lib/service/private/calculateTriggerScore";
import { logTriggerChange } from "@/lib/service/public/log/createTriggerLog";

export async function updateTriggers() {
  console.log("📡 Mise à jour des triggers en cours...");

  const cryptos = await prisma.crypto.findMany({
    where: {
      status: "pending-buy",
      NOT: { symbol: "USDC" },
    },
  });

  for (const crypto of cryptos) {
    try {
      const klines = await getKlines(crypto.symbol);

      // ⚙️ Étape 1 : ajustement du seuil d'achat
      await adjustBuyTrigger(crypto.symbol, klines);

      // ⚙️ Étape 2 : calcul du triggerScore
      const oldScore = crypto.triggerScore;
      const newScore = await calculateTriggerScore(crypto.symbol, klines);

      // 📝 Étape 3 : log si changement de score
      if (oldScore !== newScore) {
        await logTriggerChange(crypto.symbol, oldScore, newScore);
      }
    } catch (err) {
      console.error(`❌ Erreur lors du trigger de ${crypto.symbol}`, err);
    }
  }

  console.log("✅ updateTriggers() terminé.\n");
}
