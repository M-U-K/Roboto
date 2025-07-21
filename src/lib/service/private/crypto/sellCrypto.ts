import { prisma } from "@/lib/service/private/core/prisma";
import {
  getLotSizeInfo,
  floorToStepSize,
  placeMarketSellOrder,
} from "@/lib/binance/private/placeSellOrder";
import { pendingBuy } from "@/lib/service/private/database/pendingBuy";

export async function sellCrypto(symbol: string) {
  const cryptoData = await prisma.crypto.findUnique({ where: { symbol } });

  if (!cryptoData || cryptoData.status !== "pending-sell") {
    throw new Error("Crypto introuvable ou non vendable.");
  }

  const pair = `${symbol}USDC`;

  // Obtenir infos de lot/quantité minimale
  const { minQty, stepSize } = await getLotSizeInfo(pair);

  // Calcul de la quantité à vendre
  const rawQty = cryptoData.totalHoldings / cryptoData.currentPrice;
  const quantity = floorToStepSize(rawQty, stepSize);

  if (quantity < minQty) {
    throw new Error(`Quantité trop faible pour vendre. minQty = ${minQty}`);
  }

  // Envoi de la requête de vente
  const order = await placeMarketSellOrder(pair, quantity);

  // Calcul des revenus
  const fills = order.fills || [];
  const totalQty = fills.reduce(
    (acc: number, f: any) => acc + parseFloat(f.qty),
    0
  );
  const totalRevenue = fills.reduce(
    (acc: number, f: any) => acc + parseFloat(f.qty) * parseFloat(f.price),
    0
  );
  const avgSellPrice = totalRevenue / totalQty;
  const gain = totalRevenue - cryptoData.pot;

  const reinvested = gain > 0 ? gain / 8 : 0;
  const secured = gain > 0 ? (gain * 6) / 8 : 0;
  const extracted = gain > 0 ? gain / 8 : 0;

  // MAJ TradeEntry
  const openTrade = await prisma.tradeEntry.findFirst({
    where: { cryptoId: cryptoData.id, sellPrice: 0 },
    orderBy: { dateBuy: "desc" },
  });

  if (openTrade) {
    const sellPrice = totalRevenue;
    const buyPrice = openTrade.buyPrice;
    const gainLoss = sellPrice - buyPrice;
    const gainLossPct = (gainLoss / buyPrice) * 100;

    await prisma.tradeEntry.update({
      where: { id: openTrade.id },
      data: {
        dateSell: new Date(),
        sellPrice,
        gainLoss,
        gainLossPct,
        reinvested: gainLoss > 0 ? gainLoss / 8 : 0,
        secured: gainLoss > 0 ? (gainLoss * 6) / 8 : 0,
        extracted: gainLoss > 0 ? gainLoss / 8 : 0,
      },
    });
  }

  // Appel unifié pour basculer la crypto en pending-buy et mettre à jour la DB
  await pendingBuy({
    symbol,
    avgSellPrice,
    totalRevenue,
    extracted,
    secured,
    reinvested,
  });

  return {
    success: true,
    symbol,
    avgSellPrice,
    totalRevenue,
    gain,
    reinvested,
    secured,
    extracted,
  };
}
