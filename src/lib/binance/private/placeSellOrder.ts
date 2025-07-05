import { getSignedRequest } from "@/lib/binance/signRequest";

interface OrderResponse {
  orderId: number;
  fills: {
    price: string;
    qty: string;
  }[];
}

/**
 * Récupère les infos LOT_SIZE (minQty et stepSize) pour une paire.
 */
export async function getLotSizeInfo(pair: string): Promise<{
  minQty: number;
  stepSize: number;
}> {
  const res = await fetch(
    `https://api.binance.com/api/v3/exchangeInfo?symbol=${pair}`
  );
  const data = await res.json();

  const lotFilter = data.symbols?.[0]?.filters?.find(
    (f: any) => f.filterType === "LOT_SIZE"
  );

  return {
    minQty: parseFloat(lotFilter?.minQty || "0.00001"),
    stepSize: parseFloat(lotFilter?.stepSize || "0.00001"),
  };
}

/**
 * Arrondit une quantité à un multiple du stepSize de la paire.
 */
export function floorToStepSize(qty: number, stepSize: number): number {
  const precision = stepSize.toString().split(".")[1]?.length ?? 0;
  const floored = Math.floor(qty / stepSize) * stepSize;
  return parseFloat(floored.toFixed(precision));
}

/**
 * Envoie un ordre de vente MARKET signé avec ta clé privée RSA.
 */
export async function placeMarketSellOrder(
  pair: string,
  quantity: number
): Promise<OrderResponse> {
  const query = `symbol=${pair}&side=SELL&type=MARKET&quantity=${quantity}`;
  return await getSignedRequest("/api/v3/order", query, "POST");
}
