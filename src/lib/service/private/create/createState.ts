import { prisma } from "@/lib/service/private/core/prisma";

/**
 * Crée l'état initial si aucun n'existe encore.
 */
export async function createInitialState() {
  const alreadyExists = await prisma.state.findUnique({ where: { id: 1 } });

  if (alreadyExists) {
    console.log("⏩ L'état existe déjà, création ignorée.");
    return;
  }

  await prisma.state.create({
    data: {
      id: 1,
      isActive: 1,
      nbrCrypto: 0,
      nbrCryptoOn: 0,
      nbrCryptoOff: 0,
      totalGain: 0,
    },
  });

  console.log("🆕 État initial créé.");
}
