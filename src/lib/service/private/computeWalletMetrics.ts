import { prisma } from "@/lib/service/private/core/prisma";

export async function computeWalletMetrics() {
  const cryptos = await prisma.crypto.findMany();

  const totalValue = cryptos.reduce((acc, c) => acc + c.totalHoldings, 0);

  const potOn = cryptos
    .filter((c) => c.status === "pending-sell" && c.symbol !== "USDC")
    .reduce((acc, c) => acc + c.pot, 0);

  const potOff = cryptos
    .filter((c) => c.status === "pending-buy" && c.symbol !== "USDC")
    .reduce((acc, c) => acc + c.pot, 0);

  const usdc = cryptos.find((c) => c.symbol === "USDC")?.totalHoldings || 0;

  return { totalValue, potOn, potOff, usdc };
}
