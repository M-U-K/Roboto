import { prisma } from "@/lib/service/private/core/prisma";
import { createInitialState } from "./create/createState";

export async function calculateAndUpdateState() {
  const cryptos = await prisma.crypto.findMany();

  const nbrCrypto = cryptos.length;

  const nbrCryptoOn = cryptos.filter((c) => c.status === "pending-sell").length;
  const nbrCryptoOff = cryptos.filter((c) => c.status === "pending-buy").length;

  const existing = await prisma.state.findUnique({ where: { id: 1 } });
  if (!existing) {
    createInitialState();
    return;
  }

  await prisma.state.update({
    where: { id: 1 },
    data: {
      isActive: 1,
      nbrCrypto,
      nbrCryptoOn,
      nbrCryptoOff,
    },
  });

  console.log("📊 État global mis à jour.");
}
