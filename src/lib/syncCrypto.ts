import { prisma } from "@/lib/prisma";

export async function syncCrypto(symbol: string, referenceSymbol = "USDT") {
  if (symbol === referenceSymbol) return;

  const pair = `${symbol}${referenceSymbol}`;
  const priceRes = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
  );

  if (!priceRes.ok) {
    throw new Error(
      `Erreur Binance (prix ${symbol}): ${await priceRes.text()}`
    );
  }

  const { price } = await priceRes.json();
  const currentPrice = parseFloat(price);

  if (!price || isNaN(currentPrice)) {
    throw new Error(`⚠️ Prix invalide pour ${symbol} : ${price}`);
  }

  //  const accountRes = await fetch("https://api.binance.com/api/v3/account", {
  //    headers: {
  //      "X-MBX-APIKEY": process.env.BINANCE_API_KEY!,
  //    },
  //  });

  const wallet = await prisma.crypto.findUnique({ where: { symbol } });
  const holdings = wallet?.totalHoldings || 0;

  if (holdings < 2) {
    console.log(`⏩ ${symbol} ignoré (holdings < 2$)`);
    return;
  }

  const existing = await prisma.crypto.findUnique({ where: { symbol } });

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
