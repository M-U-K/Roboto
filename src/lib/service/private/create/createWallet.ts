import { prisma } from "@/lib/service/private/core/prisma";

export async function createWallet({
  totalValue,
  potOn,
  potOff,
  usdc,
}: {
  totalValue: number;
  potOn: number;
  potOff: number;
  usdc: number;
}) {
  const cash = 0;
  const security = usdc - potOff;

  return prisma.wallet.create({
    data: {
      totalValue,
      potOn,
      potOff,
      cash,
      security,
      USDC: usdc,
    },
  });
}
