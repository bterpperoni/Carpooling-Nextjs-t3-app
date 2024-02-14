/*
  Warnings:

  - You are about to drop the column `userId` on the `GroupMember` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Passenger` table. All the data in the column will be lost.
  - Added the required column `userName` to the `GroupMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Passenger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Passenger" DROP CONSTRAINT "Passenger_userId_fkey";

-- AlterTable
ALTER TABLE "GroupMember" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Passenger" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
