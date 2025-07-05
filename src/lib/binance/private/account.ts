import { getSignedRequest } from "@/lib/binance/signRequest";

export async function getAccountInfo() {
  const endpoint = "/api/v3/account";
  const queryParams = "";
  return await getSignedRequest(endpoint, queryParams);
}

interface BinanceBalance {
  asset: string;
  free: string;
  locked: string;
}

export async function getWalletBalances(): Promise<
  { symbol: string; amount: number }[]
> {
  const data = await getAccountInfo();

  return (data.balances as BinanceBalance[])
    .map((b) => ({
      symbol: b.asset,
      amount: parseFloat(b.free),
    }))
    .filter((b) => b.amount > 0);
}
