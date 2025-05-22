import crypto from "crypto";

const API_KEY = process.env.BINANCE_API_KEY!;
const API_SECRET = process.env.BINANCE_API_SECRET!;

export async function getBinanceBalance() {
  const baseUrl = "https://api.binance.com/api/v3/account";
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;

  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(query)
    .digest("hex");

  const url = `${baseUrl}?${query}&signature=${signature}`;

  const res = await fetch(url, {
    headers: {
      "X-MBX-APIKEY": API_KEY,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Binance API error: ${error}`);
  }

  const data = await res.json();
  return data;
}
