import { prisma } from "@/lib/service/private/core/prisma";
import { addNewCrypto } from "./addNewCrypto";

export async function checkAndAddCrypto() {
  const wallet = await prisma.wallet.findFirst();
  if (!wallet) return;

  const { security, potOn, potOff } = wallet;
  const potAll = potOff + potOn;
  if (security >= potAll + 10) {
    const added = await addNewCrypto();

    if (added) {
      console.log(`[CRYPTO] ➕ Nouvelle crypto ajoutée : ${added.symbol}`);
    } else {
      console.log(`[CRYPTO] ❌ Aucune crypto disponible à ajouter.`);
    }
  }
}
