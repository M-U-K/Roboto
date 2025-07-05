"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const updateWallet_1 = require("../../../lib/service/private/updateWallet");
const server_1 = require("next/server");
async function GET() {
    try {
        const wallet = await (0, updateWallet_1.updateWallet)();
        return server_1.NextResponse.json(wallet);
    }
    catch (err) {
        console.error("Erreur updateWallet :", err);
        return server_1.NextResponse.json({ error: "Erreur lors de la mise à jour du Wallet" }, { status: 500 });
    }
}
