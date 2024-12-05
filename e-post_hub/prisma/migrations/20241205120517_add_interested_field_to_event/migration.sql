-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdById" TEXT NOT NULL,
    "website" TEXT,
    "title" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "description" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "flyer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "interested" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("createdById", "description", "endDate", "endTime", "flyer", "id", "startDate", "startTime", "status", "title", "website") SELECT "createdById", "description", "endDate", "endTime", "flyer", "id", "startDate", "startTime", "status", "title", "website" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
