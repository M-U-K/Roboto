"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountInfo = getAccountInfo;
exports.getWalletBalances = getWalletBalances;
const signRequest_1 = require("@/lib/binance/signRequest");
async function getAccountInfo() {
    const endpoint = "/api/v3/account";
    const queryParams = "";
    return await (0, signRequest_1.getSignedRequest)(endpoint, queryParams);
}
async function getWalletBalances() {
    const data = await getAccountInfo();
    return data.balances
        .map((b) => ({
        symbol: b.asset,
        amount: parseFloat(b.free),
    }))
        .filter((b) => b.amount > 0);
}
