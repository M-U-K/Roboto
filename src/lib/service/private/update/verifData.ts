import { prisma } from "@/lib/service/private/core/prisma";
import { pendingBuy } from "@/lib/service/private/database/pendingBuy";
import { pendingSell } from "@/lib/service/private/database/pendingSell";
import { getCurrentPrice } from "@/lib/binance/public/ticker";

export async function verifData() {
  console.log("🔄 Vérification des informations en cours...");

  const cryptos = await prisma.crypto.findMany({
    where: {
      symbol: { not: "USDC" },
    },
    select: {
      symbol: true,
      totalHoldings: true,
      status: true,
    },
  });

  for (const crypto of cryptos) {
    const { symbol, totalHoldings, status } = crypto;

    // ⚡ On récupère le prix actuel depuis Binance

    if (totalHoldings >= 1 && status !== "pending-sell") {
      // Mise à jour du pot = totalHoldings
      const pair = `${symbol}USDC`;
      const currentPrice = await getCurrentPrice(pair);

      if (!currentPrice) {
        console.warn(`⚠️ Prix Binance indisponible pour ${symbol}, skip.`);
        continue;
      }

      await prisma.crypto.update({
        where: { symbol },
        data: { pot: totalHoldings },
      });

      await pendingSell({
        symbol,
        valueBought: 0,
        avgPrice: currentPrice, // ✅ prix réel de Binance
      });
    }

    if (totalHoldings < 1 && status !== "pending-buy") {
      const pair = `${symbol}USDC`;
      const currentPrice = await getCurrentPrice(pair);

      if (!currentPrice) {
        console.warn(`⚠️ Prix Binance indisponible pour ${symbol}, skip.`);
        continue;
      }
      await pendingBuy({
        symbol,
        avgSellPrice: currentPrice,
        totalRevenue: 0,
        reinvested: 0,
        secured: 0,
        extracted: 0,
      });
    }
  }

  console.log("✅ Vérification terminée.");
}
