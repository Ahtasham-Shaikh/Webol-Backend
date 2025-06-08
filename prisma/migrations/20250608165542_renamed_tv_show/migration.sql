/*
  Warnings:

  - You are about to drop the `tv_shows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tv_shows";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TvShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "firstAirDate" DATETIME NOT NULL,
    "lastAirDate" DATETIME,
    "thumbnail" TEXT,
    "backdrop" TEXT,
    "rating" REAL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TvComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "review" TEXT,
    "commentedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "tvShowId" INTEGER NOT NULL,
    CONSTRAINT "TvComment_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TvShow" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TvComment" ("commentedAt", "id", "rating", "review", "tvShowId", "upvotes", "userName") SELECT "commentedAt", "id", "rating", "review", "tvShowId", "upvotes", "userName" FROM "TvComment";
DROP TABLE "TvComment";
ALTER TABLE "new_TvComment" RENAME TO "TvComment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
