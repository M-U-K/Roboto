import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        totalValue,
        potOn,
        potOff,
        USDC: usdc,
        // cash & security conservés tels quels (non recalculés ici)
      },
    });
    return updated;
  } else {
    const created = await prisma.wallet.create({
      data: {
        totalValue,
        potOn,
        potOff,
        cash: 0,
        security: 0,
        USDC: usdc,
      },
    });
    return created;
  }
}
