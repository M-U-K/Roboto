-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromSymbol" TEXT NOT NULL,
    "toSymbol" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "priceAtTrade" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Crypto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "totalHoldings" REAL NOT NULL,
    "lastBuyPrice" REAL NOT NULL,
    "currentPrice" REAL NOT NULL,
    "gainLossPct" REAL NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "lastSellDate" DATETIME,
    "lastSellPrice" REAL,
    "buyTrigger" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "TradeEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cryptoId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyPrice" REAL NOT NULL,
    "currentPrice" REAL NOT NULL,
    "gainLossPct" REAL NOT NULL,
    "reinvested" REAL NOT NULL,
    "secured" REAL NOT NULL,
    "extracted" REAL NOT NULL,
    CONSTRAINT "TradeEntry_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalValue" REAL NOT NULL,
    "pot" REAL NOT NULL,
    "cash" REAL NOT NULL,
    "security" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_symbol_key" ON "Crypto"("symbol");
