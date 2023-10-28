/*
  Warnings:

  - You are about to drop the `ToDo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `experience` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_ownerId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ProfileImage" BYTEA,
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN;

-- DropTable
DROP TABLE "ToDo";

-- CreateTable
CREATE TABLE "Friendship" (
    "initiatorId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("initiatorId","recipientId")
);

-- CreateTable
CREATE TABLE "Interest" (
    "Id" SERIAL NOT NULL,
    "interest" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "postTitle" TEXT NOT NULL,
    "postDescription" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Votes" (
    "id" SERIAL NOT NULL,
    "type" "VoteType" NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostFilters" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "possibleFilterId" INTEGER NOT NULL,

    CONSTRAINT "PostFilters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PossibleFilters" (
    "id" SERIAL NOT NULL,
    "filterType" TEXT NOT NULL,

    CONSTRAINT "PossibleFilters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "maxAttendee" INTEGER NOT NULL,
    "hostId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFilter" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "possibleFilterId" INTEGER NOT NULL,

    CONSTRAINT "EventFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipments" (
    "id" SERIAL NOT NULL,
    "equipmentName" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Attendee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Votes_postId_userId_key" ON "Votes"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostFilters_postId_possibleFilterId_key" ON "PostFilters"("postId", "possibleFilterId");

-- CreateIndex
CREATE UNIQUE INDEX "PossibleFilters_filterType_key" ON "PossibleFilters"("filterType");

-- CreateIndex
CREATE UNIQUE INDEX "Event_hostId_key" ON "Event"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "EventFilter_eventId_possibleFilterId_key" ON "EventFilter"("eventId", "possibleFilterId");

-- CreateIndex
CREATE UNIQUE INDEX "_Attendee_AB_unique" ON "_Attendee"("A", "B");

-- CreateIndex
CREATE INDEX "_Attendee_B_index" ON "_Attendee"("B");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFilters" ADD CONSTRAINT "PostFilters_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFilters" ADD CONSTRAINT "PostFilters_possibleFilterId_fkey" FOREIGN KEY ("possibleFilterId") REFERENCES "PossibleFilters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFilter" ADD CONSTRAINT "EventFilter_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFilter" ADD CONSTRAINT "EventFilter_possibleFilterId_fkey" FOREIGN KEY ("possibleFilterId") REFERENCES "PossibleFilters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attendee" ADD CONSTRAINT "_Attendee_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attendee" ADD CONSTRAINT "_Attendee_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
