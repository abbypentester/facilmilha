-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "feeBuyer" REAL NOT NULL,
    "feeSeller" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "netAmount" REAL NOT NULL,
    "emissionDeadline" TEXT,
    "observation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "proofUrl" TEXT,
    "pnr" TEXT,
    "airline" TEXT,
    "pixCode" TEXT,
    "pixImage" TEXT,
    "paymentId" TEXT,
    "flightRequestId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Offer_flightRequestId_fkey" FOREIGN KEY ("flightRequestId") REFERENCES "FlightRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Offer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("airline", "amount", "createdAt", "emissionDeadline", "feeBuyer", "feeSeller", "flightRequestId", "id", "netAmount", "observation", "paymentId", "pixCode", "pixImage", "pnr", "proofUrl", "sellerId", "status", "totalPrice") SELECT "airline", "amount", "createdAt", "emissionDeadline", "feeBuyer", "feeSeller", "flightRequestId", "id", "netAmount", "observation", "paymentId", "pixCode", "pixImage", "pnr", "proofUrl", "sellerId", "status", "totalPrice" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
