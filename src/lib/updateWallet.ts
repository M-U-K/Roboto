import { prisma } from "@/lib/prisma";

export async function updateWallet() {
  const cryptos = await prisma.crypto.findMany();

  const totalValue = cryptos.reduce((acc, c) => acc + c.totalHoldings, 0);

  const potOn = cryptos
    .filter((c) => c.status === "pending-sell" && c.symbol !== "USDC")
    .reduce((acc, c) => acc + c.pot, 0);

  const potOff = cryptos
    .filter((c) => c.status === "pending-buy" && c.symbol !== "USDC")
    .reduce((acc, c) => acc + c.pot, 0);

  const usdc = cryptos.find((c) => c.symbol === "USDC")?.totalHoldings || 0;

  const wallet = await prisma.wallet.findFirst();

  if (wallet) {
    const { cash } = wallet;
    const security = usdc - (potOff + cash);

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        totalValue,
        potOn,
        potOff,
        USDC: usdc,
        security,
      },
    });

    return updated;
  } else {
    const cash = 0;
    const security = usdc - potOff;

    const created = await prisma.wallet.create({
      data: {
        totalValue,
        potOn,
        potOff,
        cash,
        security,
        USDC: usdc,
      },
    });

    return created;
  }
}
