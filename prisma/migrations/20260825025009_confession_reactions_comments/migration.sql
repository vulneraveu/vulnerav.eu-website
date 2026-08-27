-- AlterTable
ALTER TABLE "Confession" ADD COLUMN     "feelsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ConfessionComment" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "confessionId" TEXT NOT NULL,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfessionComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConfessionComment" ADD CONSTRAINT "ConfessionComment_confessionId_fkey" FOREIGN KEY ("confessionId") REFERENCES "Confession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
