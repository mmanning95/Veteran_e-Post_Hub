-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "officeNumber" TEXT,
    "officeHours" TEXT,
    "officeLocation" TEXT,
    "creatorCode" TEXT NOT NULL DEFAULT 'wc_create_admin',
    CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Admin" ("creatorCode", "id", "officeHours", "officeLocation", "officeNumber", "userId") SELECT "creatorCode", "id", "officeHours", "officeLocation", "officeNumber", "userId" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
