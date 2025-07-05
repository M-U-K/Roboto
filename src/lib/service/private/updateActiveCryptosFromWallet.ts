import { prisma } from "@/lib/service/private/core/prisma";
import { getWalletBalances } from "@/lib/binance/private/account";
import { getCurrentPrice } from "@/lib/binance/public/ticker";
import { createCrypto } from "@/lib/service/private/create/createCrypto";

export async function updateActiveCryptosFromWallet() {
  const activeCryptos = await getWalletBalances();
  const kept: string[] = [];

  for (const { symbol, amount } of activeCryptos) {
    const currentPrice = await getCurrentPrice(`${symbol}USDC`);
    if (!currentPrice) continue;

    const totalValue = amount * currentPrice;

    if (totalValue < 2) {
      console.log(`⏩ ${symbol} ignoré (valeur totale < 2$)`);
      continue;
    }

    const exists = await prisma.crypto.findUnique({ where: { symbol } });

    if (!exists) {
      await createCrypto(symbol, currentPrice, totalValue);
      console.log(`🆕 Crypto ajoutée : ${symbol}`);
    } else {
      console.log(`🔁 Crypto déjà en base : ${symbol}`);
    }

    kept.push(symbol);
  }

  return kept;
}
