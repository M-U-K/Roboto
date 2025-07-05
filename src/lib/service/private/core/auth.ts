import { NextRequest } from "next/server";

export function verifyAuth(req: NextRequest): boolean {
  const secret = req.headers.get("x-secret");
  return secret === process.env.API_SECRET;
}
