import { getSignedRequest } from "@/lib/binance/signRequest";

export async function placeMarketBuyOrder(symbol: string, investment: number) {
  const pair = `${symbol}USDC`;
  const query = `symbol=${pair}&side=BUY&type=MARKET&quoteOrderQty=${investment}`;

  const order = await getSignedRequest("/api/v3/order", query, "POST");

  const fills = order.fills || [];
  const totalQty = fills.reduce(
    (acc: number, f: any) => acc + parseFloat(f.qty),
    0
  );
  const avgPrice =
    fills.reduce(
      (acc: number, f: any) => acc + parseFloat(f.price) * parseFloat(f.qty),
      0
    ) / totalQty;
  const valueBought = totalQty * avgPrice;

  return {
    totalQty,
    avgPrice,
    valueBought,
  };
}
