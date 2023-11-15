/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId,type]` on the table `Votes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Votes_postId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Votes_postId_userId_type_key" ON "Votes"("postId", "userId", "type");
