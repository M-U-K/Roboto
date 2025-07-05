import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function getSignedRequest(
  endpoint: string,
  queryParams: string = "",
  method: "GET" | "POST" | "DELETE" = "GET"
) {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}&${queryParams}`.replace(/&$/, "");

  const privateKeyPath = process.env.BINANCE_RSA_PRIVATE_PATH!;
  const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(query);
  sign.end();
  const signature = sign.sign(privateKey, "base64");

  const url = `https://api.binance.com${endpoint}?${query}&signature=${signature}`;

  const res = await fetch(url, {
    method,
    headers: {
      "X-MBX-APIKEY": process.env.BINANCE_API_KEY!,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Erreur Binance API: ${errorBody}`);
  }

  return res.json();
}
