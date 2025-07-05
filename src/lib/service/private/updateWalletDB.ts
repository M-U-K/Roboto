import { prisma } from "@/lib/service/private/core/prisma";

export async function updateWalletInDB({
  id,
  totalValue,
  potOn,
  potOff,
  usdc,
  cash,
}: {
  id: string;
  totalValue: number;
  potOn: number;
  potOff: number;
  usdc: number;
  cash: number;
}) {
  const security = usdc - (potOff + cash);

  return prisma.wallet.update({
    where: { id },
    data: {
      totalValue,
      potOn,
      potOff,
      USDC: usdc,
      security,
    },
  });
}
