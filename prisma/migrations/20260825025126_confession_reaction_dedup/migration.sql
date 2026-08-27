-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'FEEL');

-- CreateTable
CREATE TABLE "ConfessionReaction" (
    "id" TEXT NOT NULL,
    "confessionId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfessionReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfessionReaction_confessionId_ipHash_type_key" ON "ConfessionReaction"("confessionId", "ipHash", "type");

-- AddForeignKey
ALTER TABLE "ConfessionReaction" ADD CONSTRAINT "ConfessionReaction_confessionId_fkey" FOREIGN KEY ("confessionId") REFERENCES "Confession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
