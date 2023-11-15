/*
  Warnings:

  - You are about to drop the column `experience` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "experience",
ADD COLUMN     "gymFrequency" TEXT,
ADD COLUMN     "shortBio" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUBLIC';
