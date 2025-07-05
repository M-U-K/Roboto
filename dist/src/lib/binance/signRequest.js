"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedRequest = getSignedRequest;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
async function getSignedRequest(endpoint, queryParams = "", method = "GET") {
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}&${queryParams}`.replace(/&$/, "");
    const privateKeyPath = process.env.BINANCE_RSA_PRIVATE_PATH;
    const privateKey = fs_1.default.readFileSync(path_1.default.resolve(privateKeyPath), "utf8");
    const sign = crypto_1.default.createSign("RSA-SHA256");
    sign.update(query);
    sign.end();
    const signature = sign.sign(privateKey, "base64");
    const url = `https://api.binance.com${endpoint}?${query}&signature=${signature}`;
    const res = await fetch(url, {
        method,
        headers: {
            "X-MBX-APIKEY": process.env.BINANCE_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Erreur Binance API: ${errorBody}`);
    }
    return res.json();
}
