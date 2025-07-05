import { prisma } from "@/lib/service/private/core/prisma";

export async function checkAutoSell(symbol: string) {
  const crypto = await prisma.crypto.findUnique({ where: { symbol } });

  if (!crypto) {
    console.warn(`❌ Crypto non trouvée : ${symbol}`);
    return;
  }

  if (crypto.status !== "pending-sell") {
    console.log(`⏩ ${symbol} ignorée (status = ${crypto.status})`);
    return;
  }

  if (!crypto.sellAt || !crypto.currentPrice) {
    console.warn(
      `⚠️ ${symbol} : données incomplètes (sellAt ou currentPrice manquant)`
    );
    return;
  }

  if (crypto.totalHoldings >= crypto.sellAt) {
    console.log(
      `🚀 ${symbol} atteint son seuil de vente (${crypto.currentPrice} >= ${crypto.sellAt})`
    );

    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/trade/sell/${symbol}`,
        {
          method: "POST",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        console.error(`❌ Erreur lors de la vente de ${symbol}`, result);
      } else {
        console.log(`✅ Vente automatique exécutée pour ${symbol}`);
      }
    } catch (err) {
      console.error(`❌ Échec de l’appel de vente pour ${symbol}`, err);
    }
  } else {
    console.log(
      `📉 ${symbol} pas encore au seuil (${crypto.currentPrice} < ${crypto.sellAt})`
    );
  }
}
