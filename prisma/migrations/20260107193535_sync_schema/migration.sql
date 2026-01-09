-- AlterTable
ALTER TABLE "Offer" ADD COLUMN "airline" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlightRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "tripType" TEXT NOT NULL DEFAULT 'ONE_WAY',
    "passengersCount" INTEGER NOT NULL DEFAULT 1,
    "flexibility" BOOLEAN NOT NULL DEFAULT false,
    "observation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "buyerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FlightRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FlightRequest" ("buyerId", "createdAt", "departDate", "destination", "flexibility", "id", "observation", "origin", "status") SELECT "buyerId", "createdAt", "departDate", "destination", "flexibility", "id", "observation", "origin", "status" FROM "FlightRequest";
DROP TABLE "FlightRequest";
ALTER TABLE "new_FlightRequest" RENAME TO "FlightRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
