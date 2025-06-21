-- CreateTable
CREATE TABLE "State" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "isActive" INTEGER NOT NULL,
    "nbrCrypto" INTEGER NOT NULL,
    "nbrCryptoOn" INTEGER NOT NULL,
    "nbrCryptoOff" INTEGER NOT NULL,
    "totalGain" REAL NOT NULL
);
