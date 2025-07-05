// lib/service/public/getState.ts
import { prisma } from "@/lib/service/private/core/prisma";

export async function getState() {
  const state = await prisma.state.findUnique({
    where: { id: 1 },
  });

  if (!state) throw new Error("État introuvable.");

  return {
    isActive: state.isActive,
    nbrCrypto: state.nbrCrypto,
    nbrCryptoOn: state.nbrCryptoOn,
    nbrCryptoOff: state.nbrCryptoOff,
    totalGain: state.totalGain,
  };
}
