// lib/adjustBuyTrigger.ts
import { prisma } from "@/lib/prisma";

export async function adjustBuyTrigger(symbol: string, klines: any[]) {
  // On calcule la volatilité moyenne sur 30 jours : (high - low) / close
  const volatilities = klines.map((k: any) => {
    const high = parseFloat(k[2]);
    const low = parseFloat(k[3]);
    const close = parseFloat(k[4]);
    return (high - low) / close;
  });

  const avgVolatility =
    volatilities.reduce((a, b) => a + b, 0) / volatilities.length;

  // Palier de volatilité (tu peux ajuster les seuils si besoin)
  let palier = 1;
  if (avgVolatility < 0.01) palier = 5;
  else if (avgVolatility < 0.015) palier = 4;
  else if (avgVolatility < 0.025) palier = 3;
  else if (avgVolatility < 0.035) palier = 2;
  else palier = 1;

  // Tableau de buyTrigger selon le palier (sécurité ignorée ici, à gérer ailleurs)
  const buyTriggers: Record<number, number> = {
    1: 15,
    2: 10,
    3: 6,
    4: 5,
    5: 4,
  };

  await prisma.crypto.update({
    where: { symbol },
    data: {
      buyTrigger: buyTriggers[palier],
      volatility: palier, // 👈 correspond bien au "niveau de volatilité"
    },
  });
}
