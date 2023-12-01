-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "gymFrequency" TEXT,
    "verified" BOOLEAN,
    "shortBio" TEXT,
    "ProfileImage" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
CREATE TABLE "EventAttendee" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("id")
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
    "short_description" TEXT NOT NULL,
    "long_description" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,

    CONSTRAINT "Equipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Votes_postId_userId_key" ON "Votes"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostFilters_postId_possibleFilterId_key" ON "PostFilters"("postId", "possibleFilterId");

-- CreateIndex
CREATE UNIQUE INDEX "PossibleFilters_filterType_key" ON "PossibleFilters"("filterType");

-- CreateIndex
CREATE UNIQUE INDEX "Event_hostId_key" ON "Event"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_eventId_userId_key" ON "EventAttendee"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventFilter_eventId_possibleFilterId_key" ON "EventFilter"("eventId", "possibleFilterId");

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
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFilter" ADD CONSTRAINT "EventFilter_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFilter" ADD CONSTRAINT "EventFilter_possibleFilterId_fkey" FOREIGN KEY ("possibleFilterId") REFERENCES "PossibleFilters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "Equipments" ("equipmentName", "short_description", "long_description", "image_path") 
VALUES 
('Treadmill', 'Compact Treadmill', 'A high-quality, space-saving treadmill for home use', '/images/treadmill.jpg'),
('Exercise Bike', 'Stationary Bike', 'Durable and comfortable stationary exercise bike', '/images/exercise_bike.jpg'),
('Dumbbells', 'Set of Dumbbells', 'A set of adjustable dumbbells for strength training', '/images/dumbbells.jpg'),
('Yoga Mat', 'Eco-friendly Yoga Mat', 'Non-slip, eco-friendly yoga mat for all types of yoga', '/images/yoga_mat.jpg'),
('Resistance Bands', 'Strength Bands', 'A set of resistance bands of varying strengths for flexibility and strength workouts', '/images/resistance_bands.jpg'),
('Kettlebell', 'Cast Iron Kettlebell', 'A heavy-duty cast iron kettlebell for strength training', '/images/kettlebell.jpg'),
('Rowing Machine', 'Indoor Rower', 'A smooth and quiet indoor rowing machine', '/images/rowing_machine.jpg'),
('Elliptical Trainer', 'Compact Elliptical', 'Space-efficient elliptical trainer for low-impact cardio', '/images/elliptical.jpg'),
('Foam Roller', 'Muscle Roller', 'High-density foam roller for muscle recovery and flexibility', '/images/foam_roller.jpg'),
('Punching Bag', 'Heavy Punching Bag', 'Durable heavy bag for boxing and martial arts training', '/images/punching_bag.jpg');

INSERT INTO "User" ("name", "password", "email")
VALUES
('admin', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'admin@calpoly.edu');

INSERT INTO "User" ("name", "password", "email")
VALUES
('admin2', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'admin2@calpoly.edu');

INSERT INTO "User" ("name", "password", "email")
VALUES
('admin3', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'admin3@calpoly.edu');

INSERT INTO "PossibleFilters" ("filterType")
VALUES
('General'), 
('Discussions'), 
('Sports'), 
('Exercise'), 
('ASI'), 
('Events');


INSERT INTO "Post" ("postTitle", "postDescription", "authorId")
VALUES
('Title of Post 1', 'Description of Post 1', 1),
('Title of Post 2', 'Description of Post 2', 2),
('Title of Post 3', 'Description of Post 3', 3);
