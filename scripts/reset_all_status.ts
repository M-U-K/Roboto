import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetAllStatuses() {
  const allCryptos = await prisma.crypto.findMany();

  for (const crypto of allCryptos) {
    await prisma.crypto.update({
      where: { id: crypto.id },
      data: { status: "pending-buy" },
    });
    console.log(`🔄 ${crypto.symbol} → status = pending-buy`);
  }

  console.log("✅ Tous les statuts ont été remis à 'pending-buy'.");
  await prisma.$disconnect();
}

resetAllStatuses().catch((err) => {
  console.error("❌ Erreur lors du reset des statuts :", err);
  prisma.$disconnect();
  process.exit(1);
});
