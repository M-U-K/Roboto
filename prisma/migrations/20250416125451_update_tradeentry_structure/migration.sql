/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `TradeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `TradeEntry` table. All the data in the column will be lost.
  - Added the required column `dateBuy` to the `TradeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateSell` to the `TradeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gainLoss` to the `TradeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellPrice` to the `TradeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TradeEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cryptoId" TEXT NOT NULL,
    "dateBuy" DATETIME NOT NULL,
    "dateSell" DATETIME NOT NULL,
    "buyPrice" REAL NOT NULL,
    "sellPrice" REAL NOT NULL,
    "gainLossPct" REAL NOT NULL,
    "gainLoss" REAL NOT NULL,
    "reinvested" REAL NOT NULL,
    "secured" REAL NOT NULL,
    "extracted" REAL NOT NULL,
    CONSTRAINT "TradeEntry_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TradeEntry" ("buyPrice", "cryptoId", "extracted", "gainLossPct", "id", "reinvested", "secured") SELECT "buyPrice", "cryptoId", "extracted", "gainLossPct", "id", "reinvested", "secured" FROM "TradeEntry";
DROP TABLE "TradeEntry";
ALTER TABLE "new_TradeEntry" RENAME TO "TradeEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
