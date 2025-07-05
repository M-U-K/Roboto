import { updateActiveCryptosFromWallet } from "@/lib/service/private/updateActiveCryptosFromWallet";
import { syncCrypto } from "@/lib/service/private/syncCrypto";
import { checkAutoSell } from "@/lib/service/private/crypto/checkAutoSell";
import { prisma } from "@/lib/service/private/core/prisma";
import { getWalletBalances } from "@/lib/binance/private/account";

export async function performFullSync() {
  const active = await updateActiveCryptosFromWallet();

  for (const symbol of active) {
    await syncCrypto(symbol);
    await checkAutoSell(symbol);
  }

  const balances = await getWalletBalances();

  for (const { symbol, amount } of balances) {
    if (symbol !== "USDT") {
      const crypto = await prisma.crypto.findUnique({
        where: { symbol },
      });
      if (crypto?.currentPrice) {
        const valueInDollars = amount * crypto.currentPrice;
        await prisma.crypto.update({
          where: { symbol },
          data: { totalHoldings: valueInDollars },
        });
      }
    }
  }

  const allCryptos = await prisma.crypto.findMany({
    orderBy: { symbol: "asc" },
  });

  return allCryptos;
}
