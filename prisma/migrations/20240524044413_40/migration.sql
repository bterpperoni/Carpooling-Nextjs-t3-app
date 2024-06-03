/*
  Warnings:

  - The `distanceWithDetour` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `locality` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "distanceWithDetour",
ADD COLUMN     "distanceWithDetour" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locality",
DROP COLUMN "zip",
ADD COLUMN     "phone" TEXT;
