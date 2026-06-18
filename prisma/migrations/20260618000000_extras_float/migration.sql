-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payPeriodId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "riders" INTEGER NOT NULL,
    "shift" TEXT NOT NULL,
    "extras" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Entry_payPeriodId_fkey" FOREIGN KEY ("payPeriodId") REFERENCES "PayPeriod" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Entry" SELECT "id", "payPeriodId", "date", "riders", "shift", CAST("extras" AS REAL), "notes", "createdAt" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_key_check("Entry");
PRAGMA foreign_keys=ON;
