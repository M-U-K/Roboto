// lib/private/syncCrypto.ts
import { prisma } from "@/lib/service/private/core/prisma";
import { getCurrentPrice } from "@/lib/binance/public/ticker";

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

  const existing = wallet;

  if (existing) {
    let gainLoss = 0;
    if (existing.lastBuyPrice > 0) {
      gainLoss =
        ((currentPrice - existing.lastBuyPrice) / existing.lastBuyPrice) * 100;
    }

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
  } else {
    await prisma.crypto.create({
      data: {
        symbol,
        totalHoldings: 0,
        lastBuyPrice: currentPrice,
        currentPrice,
        gainLossPct: 0,
        buyTrigger: 0,
        status: "pending-buy",
      },
    });
    console.log(`🆕 Crypto ajoutée : ${symbol}`);
  }

  console.log(`${symbol} synchronisé à ${currentPrice} ${referenceSymbol}`);
}
