import { prisma } from "@/lib/service/private/core/prisma";
import { buyCrypto } from "@/lib/service/private/crypto/buyCrypto";

export async function checkBuy() {
  const cryptos = await prisma.crypto.findMany({
    where: {
      status: "pending-buy",
    },
  });

  for (const crypto of cryptos) {
    const { symbol, triggerScore, buyTrigger } = crypto;

    if (triggerScore >= buyTrigger && buyTrigger > 0) {
      console.log(
        `🔥 ${symbol} prêt à être acheté (triggerScore = ${triggerScore}, buyTrigger = ${buyTrigger})`
      );

      try {
        const result = await buyCrypto(symbol);
        console.log(`✅ Achat automatique : ${symbol}`, result);
      } catch (error) {
        console.error(`❌ Erreur achat ${symbol} :`, error);
      }
    } else {
      console.log(
        `⏳ ${symbol} pas encore prêt (triggerScore = ${triggerScore}, buyTrigger = ${buyTrigger})`
      );
    }
  }
}
