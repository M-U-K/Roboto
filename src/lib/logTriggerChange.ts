import { prisma } from "@/lib/prisma";

/**
 * Enregistre un changement de score trigger pour une crypto.
 * @param symbol Le symbole de la crypto (ex: BTC)
 * @param change Le changement appliqué (+1, -2, etc.)
 * @param newScore Le score final après application
 */
export async function logTriggerChange(
  symbol: string,
  change: number,
  newScore: number
) {
  try {
    await prisma.triggerLog.create({
      data: {
        symbol,
        change,
        newScore,
      },
    });
  } catch (error) {
    console.error(`Erreur lors du log de trigger pour ${symbol} :`, error);
  }
}
