import { computeWalletMetrics } from "@/lib/service/private/computeWalletMetrics";
import { createWallet } from "@/lib/service/private/create/createWallet";
import { updateWalletInDB } from "@/lib/service/private/updateWalletDB";
import { prisma } from "@/lib/service/private/core/prisma";

export async function updateWallet() {
  console.log("🔄 Mise à jour du wallet en cours...");

  const { totalValue, potOn, potOff, usdc } = await computeWalletMetrics();
  const wallet = await prisma.wallet.findFirst();

  if (wallet) {
    await updateWalletInDB({
      id: wallet.id,
      totalValue,
      potOn,
      potOff,
      usdc,
      cash: wallet.cash,
    });
    console.log("🔁 Wallet mis à jour");
  } else {
    await createWallet({ totalValue, potOn, potOff, usdc });
    console.log("🆕 Wallet créé");
  }

  console.log("✅ Mise à jour du wallet terminée.");
}
