import { prisma } from "@/lib/service/private/core/prisma";
import { getWalletBalances } from "@/lib/binance/private/account";
import { getCurrentPrice } from "@/lib/binance/public/ticker";
import { createCrypto } from "@/lib/service/private/create/createCrypto";

export async function updateActiveCryptosFromWallet() {
  const activeCryptos = await getWalletBalances();
  const kept: string[] = [];

  for (const { symbol, amount } of activeCryptos) {
    // 🪙 Skip USDC → il est géré en bas
    if (symbol === "USDC") continue;

    const currentPrice = await getCurrentPrice(`${symbol}USDC`);
    if (!currentPrice) continue;

    const totalValue = amount * currentPrice;

    if (totalValue < 2) {
      console.log(`⏩ ${symbol} ignoré (valeur totale < 2$)`);
      continue;
    }

    const existing = await prisma.crypto.findUnique({ where: { symbol } });

    if (!existing) {
      await createCrypto(symbol, currentPrice, totalValue);
      console.log(`🆕 Crypto ajoutée : ${symbol}`);
    } else {
      await prisma.crypto.update({
        where: { symbol },
        data: {
          currentPrice,
          totalHoldings: totalValue,
        },
      });
      console.log(`🔄 Crypto mise à jour : ${symbol}`);
    }

    kept.push(symbol);
  }

  // 💰 Met à jour la valeur USDC dans le wallet
  const usdc = activeCryptos.find((c) => c.symbol === "USDC");
  if (usdc) {
    const existingUSDC = await prisma.crypto.findUnique({
      where: { symbol: "USDC" },
    });

    if (existingUSDC) {
      await prisma.crypto.update({
        where: { symbol: "USDC" },
        data: {
          currentPrice: 1,
          totalHoldings: usdc.amount,
        },
      });
    }
    console.log(`💰 USDC mis à jour dans wallet : ${usdc.amount}`);
  }

  return kept;
}
