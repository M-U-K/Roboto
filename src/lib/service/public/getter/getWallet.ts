// lib/service/public/getWallet.ts
import { prisma } from "@/lib/service/private/core/prisma";

export async function getWallet() {
  const wallet = await prisma.wallet.findFirst();

  if (!wallet) throw new Error("Wallet introuvable.");

  return {
    totalValue: wallet.totalValue,
    potOn: wallet.potOn,
    potOff: wallet.potOff,
    cash: wallet.cash,
    security: wallet.security,
    USDC: wallet.USDC,
  };
}
