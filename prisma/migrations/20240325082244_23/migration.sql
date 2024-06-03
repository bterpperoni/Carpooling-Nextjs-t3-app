/*
  Warnings:

  - You are about to drop the column `returnDateTime` on the `Ride` table. All the data in the column will be lost.
  - The `status` column on the `Ride` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Passenger` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `maxPassengers` on table `Ride` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'BANNED');

-- CreateEnum
CREATE TYPE "RideType" AS ENUM ('ALLER', 'RETOUR');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Passenger" DROP CONSTRAINT "Passenger_RideId_fkey";

-- DropForeignKey
ALTER TABLE "Passenger" DROP CONSTRAINT "Passenger_userName_fkey";

-- DropIndex
DROP INDEX "departure";

-- DropIndex
DROP INDEX "destination";

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "returnDateTime",
ADD COLUMN     "maxDetourDist" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "returnTime" TIMESTAMP(3),
ADD COLUMN     "type" "RideType" NOT NULL DEFAULT 'ALLER',
ALTER COLUMN "maxPassengers" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "RideStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Passenger";

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "rideId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "pickupPoint" TEXT NOT NULL,
    "pickupLatitude" DOUBLE PRECISION NOT NULL,
    "pickupLongitude" DOUBLE PRECISION NOT NULL,
    "price" TEXT NOT NULL,
    "driverRating" INTEGER,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
