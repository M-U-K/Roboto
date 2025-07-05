import { prisma } from "@/lib/service/private/core/prisma";
import { sellCrypto } from "@/lib/service/private/crypto/sellCrypto";

export async function checkSell() {
  const cryptos = await prisma.crypto.findMany({
    where: {
      status: "pending-sell",
      sellAt: { not: 0 },
      currentPrice: { not: 0 },
    },
  });

  for (const crypto of cryptos) {
    if (!crypto.sellAt || !crypto.currentPrice) continue;

    if (crypto.totalHoldings >= crypto.sellAt) {
      console.log(
        `🚀 ${crypto.symbol} atteint son seuil de vente (${crypto.totalHoldings} >= ${crypto.sellAt})`
      );

      try {
        const result = await sellCrypto(crypto.symbol);
        console.log(`✅ Vente automatique : ${crypto.symbol}`, result);
      } catch (error) {
        console.error(`❌ Erreur vente ${crypto.symbol} :`, error);
      }
    } else {
      console.log(
        `📉 ${crypto.symbol} pas encore au seuil (${crypto.totalHoldings} < ${crypto.sellAt})`
      );
    }
  }
}
