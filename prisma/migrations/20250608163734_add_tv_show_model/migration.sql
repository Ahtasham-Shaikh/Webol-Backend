-- CreateTable
CREATE TABLE "tv_shows" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "firstAirDate" DATETIME NOT NULL,
    "lastAirDate" DATETIME,
    "thumbnail" TEXT,
    "backdrop" TEXT,
    "rating" REAL
);

-- CreateTable
CREATE TABLE "TvComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "review" TEXT,
    "commentedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "tvShowId" INTEGER NOT NULL,
    CONSTRAINT "TvComment_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "tv_shows" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
