import { prisma } from "@/lib/service/private/core/prisma";
import { getCurrentPrice } from "@/lib/binance/public/ticker";
import { createCrypto } from "@/lib/service/private/create/createCrypto";

export async function syncCrypto(symbol: string, referenceSymbol = "USDT") {
  if (symbol === referenceSymbol) return;

  const currentPrice = await getCurrentPrice(`${symbol}${referenceSymbol}`);
  if (!currentPrice || isNaN(currentPrice)) {
    throw new Error(`⚠️ Prix invalide pour ${symbol}`);
  }

  const wallet = await prisma.crypto.findUnique({ where: { symbol } });
  const holdings = wallet?.totalHoldings || 0;

  if (holdings < 2) {
    console.log(`⏩ ${symbol} ignoré (holdings < 2$)`);
    return;
  }

  if (!wallet) {
    await createCrypto(symbol, currentPrice);
    console.log(`🆕 Crypto ajoutée : ${symbol}`);
    return;
  }

  const gainLoss =
    wallet.lastBuyPrice > 0
      ? ((currentPrice - wallet.lastBuyPrice) / wallet.lastBuyPrice) * 100
      : 0;

  console.log("🧪 UPDATE", {
    symbol,
    currentPrice,
    gainLossPct: gainLoss,
  });

  await prisma.crypto.update({
    where: { symbol },
    data: {
      currentPrice,
      gainLossPct: gainLoss,
    },
  });

  console.log(`${symbol} synchronisé à ${currentPrice} ${referenceSymbol}`);
}
