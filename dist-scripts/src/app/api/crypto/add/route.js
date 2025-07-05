"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
// /app/api/crypto/add/route.ts
const server_1 = require("next/server");
const addNewCrypto_1 = require("@/lib/service/private/addNewCrypto");
async function GET() {
    try {
        const added = await (0, addNewCrypto_1.addNewCrypto)();
        if (added) {
            return server_1.NextResponse.json({
                success: true,
                message: `Crypto ajoutée : ${added.symbol}`,
            });
        }
        else {
            return server_1.NextResponse.json({
                success: false,
                message: "Aucune crypto ajoutée (sécurité insuffisante ou plus de candidates).",
            });
        }
    }
    catch (error) {
        console.error("Erreur ajout crypto :", error);
        return server_1.NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
    }
}
