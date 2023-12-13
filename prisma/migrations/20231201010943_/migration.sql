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
('Cable Back Rows', 'Upper Back Strength', 'Cable Back Rows are a compound exercise targeting the upper back muscles, including the latissimus dorsi, rhomboids, and traps. Utilize a cable machine for this movement by pulling the handle toward your chest while maintaining proper form.', '/images/cablerow.webp'),
('Bulgarian Split Squat', 'Leg Strength and Stability', 'The Bulgarian Split Squat is a single-leg exercise that focuses on the quadriceps, hamstrings, and glutes. Stand with one foot forward and the other on an elevated surface, lowering your body into a lunge position for an effective lower body workout.', '/images/bss.jpeg'),
('Chest Fly', 'Pectoral Isolation', 'The Chest Fly is an isolation exercise targeting the pectoralis major muscles. Perform this movement on a chest fly machine or with dumbbells, bringing your arms from an extended position outward to enhance chest muscle definition.', '/images/chestfly.jpeg'),
('Stair Master', 'Cardiovascular Endurance', 'The Stair Master simulates climbing stairs and engages muscles in the lower body, including the quadriceps, hamstrings, calves, and glutes. This cardiovascular exercise promotes endurance and calorie burning for an effective workout.', '/images/stair.jpeg'),
('Deadlift', 'Total Body Strength', 'The Deadlift is a compound movement where you lift a loaded barbell from the ground to a standing position, engaging multiple muscle groups. Targeting the erector spinae, glutes, hamstrings, lats, traps, and forearms, the Deadlift promotes overall strength, muscle development, and functional fitness. Maintain a neutral spine, engage your core, and start with lighter weights to perfect form.', '/images/deadlift.jpeg'),
('Dumbbell Curl', 'Bicep Isolation', 'Dumbbell Curls involve flexing the elbow to lift dumbbells, targeting the biceps for muscle growth and definition. This isolation exercise targets the biceps brachii and brachialis. To maximize benefits, keep your elbows close to your body, use a full range of motion, and avoid swinging your body for momentum.', '/images/curl.webp'),
('Barbell Shoulder Press', 'Shoulder Strength', 'The Barbell Shoulder Press involves lifting a barbell from shoulder height to overhead, targeting the shoulder muscles. This compound exercise targets the deltoids, trapezius, and triceps. To ensure safety and effectiveness, maintain a stable grip, use proper form to avoid lower back strain, and start with lighter weights to build strength gradually.', '/images/barbellshoulder.webp'),
('Hamstring Machine Curl', 'Isolate Hamstring Muscles', 'The Hamstring Machine Curl is designed to isolate and strengthen the hamstring muscles. Adjust the machine to suit your body and target the hamstrings for improved muscle tone and functionality.', '/images/hamstring.jpeg'),
('Calf Raise Machine', 'Develop Calf Muscles', 'The Calf Raise Machine is essential for targeting the calf muscles. Adjust the machine to provide resistance as you perform calf raises, promoting muscle growth and strength in the calves.', '/images/calfraise.webp'),
('Lat Pulldown', 'Upper Back Strength', 'The Lat Pulldown involves pulling a bar or handle down towards the chest from an overhead position. It targets the muscles in the upper back, including the latissimus dorsi, rhomboids, and trapezius. Keep a straight back, initiate the movement with your lats, and adjust the weight for optimal engagement.', '/images/latpulldown.webp'),
('Elliptical', 'Low-Impact Cardio', 'The Elliptical is a low-impact cardio machine that simulates running or walking without causing stress on the joints. It engages the muscles in the legs, including the quadriceps, hamstrings, and calves, while also providing an effective cardiovascular workout. Customize resistance and duration for your fitness level.', '/images/elliptical.jpg'),
('Bench Press', 'Upper Body Strength', 'The Bench Press is a classic upper body exercise where you lie on a flat bench and lift a barbell or dumbbells from chest level to full arm extension. It primarily targets the chest, shoulders, and triceps. Maintain a stable grip, keep your feet flat on the floor, and use a spotter for heavier lifts.', '/images/bench.webp'),
('Treadmill', 'Cardiovascular Endurance', 'The Treadmill is a versatile cardio machine that allows you to walk, jog, or run indoors. It engages the muscles in the legs and promotes cardiovascular endurance. Adjust speed and incline to tailor your workout intensity. A treadmill provides a convenient way to achieve effective cardio exercise.', '/images/treadmill.jpg'),
('Tricep Dips', 'Tricep and Chest Workout', 'Tricep Dips are a bodyweight exercise that targets the triceps and chest. Use parallel bars or a sturdy surface to lower and lift your body, engaging the triceps, deltoids, and pectoral muscles. Maintain an upright position, avoid leaning too far forward, and control the movement for optimal results.', '/images/dips.webp'),
('Tricep Pushdown', 'Isolate Tricep Muscles', 'The Tricep Pushdown is performed using a cable machine with a straight or V-bar attachment. It focuses on extending the elbow to engage and strengthen the triceps. Keep elbows close to your body, use a controlled motion, and avoid locking your elbows at the bottom of the movement.', '/images/pushdown.webp');

INSERT INTO "User" ("name", "password", "email")
VALUES
('admin', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'admin@calpoly.edu'),
('admin2', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'admin2@calpoly.edu'),
('admin3', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'admin3@calpoly.edu'),
('annie', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'annie@calpoly.edu'),
('bobby', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'bobby@calpoly.edu'),
('cindy', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'cindy@calpoly.edu'),
('david', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'david@calpoly.edu'),
('eric', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'eric@calpoly.edu'),
('frank', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'frank@calpoly.edu'),
('gina', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'gina@calpoly.edu'),
('harry', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'harry@calpoly.edu'),
('ian', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'ian@calpoly.edu'),
('jessica', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'jessica@calpoly.edu'),
('kyle', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'kyle@calpoly.edu'),
('lisa', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'lisa@calpoly.edu'),
('mike', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'mike@calpoly.edu'),
('nancy', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'nancy@calpoly.edu'),
('olivia', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'oliva@calpoly.edu'),
('peter', '$2a$10$ApKSbcr80X.AvrZn5HhxY.59TkwXrUyUbz6ZHRXhSNJFoOGEyTSLe', 'peter@calpoly.edu');


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