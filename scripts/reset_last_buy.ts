import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetLastBuyToCurrent() {
  const allCryptos = await prisma.crypto.findMany();

  for (const crypto of allCryptos) {
    await prisma.crypto.update({
      where: { id: crypto.id },
      data: {
        lastBuyPrice: crypto.currentPrice,
      },
    });
    console.log(
      `🔄 ${crypto.symbol} - lastBuyPrice mis à jour: ${crypto.currentPrice}`
    );
  }

  console.log("✅ Tous les lastBuyPrice ont été remis à jour.");
  await prisma.$disconnect();
}

resetLastBuyToCurrent().catch((e) => {
  console.error("❌ Erreur lors du reset:", e);
  prisma.$disconnect();
  process.exit(1);
});
