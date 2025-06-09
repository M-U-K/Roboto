/*
  Warnings:

  - You are about to drop the column `pot` on the `Wallet` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalValue" REAL NOT NULL,
    "potOn" REAL NOT NULL DEFAULT 0,
    "potOff" REAL NOT NULL DEFAULT 0,
    "cash" REAL NOT NULL,
    "security" REAL NOT NULL,
    "USDC" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Wallet" ("USDC", "cash", "id", "security", "totalValue", "updatedAt") SELECT "USDC", "cash", "id", "security", "totalValue", "updatedAt" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
