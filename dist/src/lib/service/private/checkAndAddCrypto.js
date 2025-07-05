"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndAddCrypto = checkAndAddCrypto;
const prisma_1 = require("@/lib/service/private/prisma");
const addNewCrypto_1 = require("./addNewCrypto");
async function checkAndAddCrypto() {
    const wallet = await prisma_1.prisma.wallet.findFirst();
    if (!wallet)
        return;
    const { security, potOn, potOff } = wallet;
    const potAll = potOff + potOn;
    if (security >= potAll + 10) {
        const added = await (0, addNewCrypto_1.addNewCrypto)();
        if (added) {
            console.log(`[CRYPTO] ➕ Nouvelle crypto ajoutée : ${added.symbol}`);
        }
        else {
            console.log(`[CRYPTO] ❌ Aucune crypto disponible à ajouter.`);
        }
    }
}
