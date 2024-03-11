/*
  Warnings:

  - You are about to drop the column `travelId` on the `Passenger` table. All the data in the column will be lost.
  - You are about to drop the `Travel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `RideId` to the `Passenger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Passenger" DROP CONSTRAINT "Passenger_travelId_fkey";

-- DropForeignKey
ALTER TABLE "Travel" DROP CONSTRAINT "Travel_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Travel" DROP CONSTRAINT "Travel_groupId_fkey";

-- AlterTable
ALTER TABLE "Passenger" DROP COLUMN "travelId",
ADD COLUMN     "RideId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Travel";

-- CreateTable
CREATE TABLE "Ride" (
    "id" SERIAL NOT NULL,
    "isForGroup" BOOLEAN NOT NULL DEFAULT false,
    "groupId" INTEGER,
    "driverId" TEXT NOT NULL,
    "departure" TEXT NOT NULL,
    "departureLatitude" DOUBLE PRECISION NOT NULL,
    "departureLongitude" DOUBLE PRECISION NOT NULL,
    "departureDateTime" TIMESTAMP(3) NOT NULL,
    "destination" TEXT NOT NULL,
    "destinationLatitude" DOUBLE PRECISION NOT NULL,
    "destinationLongitude" DOUBLE PRECISION NOT NULL,
    "returnDateTime" TIMESTAMP(3),
    "maxPassengers" INTEGER DEFAULT 2,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "departure" ON "Ride"("departureLatitude", "departureLongitude");

-- CreateIndex
CREATE INDEX "destination" ON "Ride"("destinationLatitude", "destinationLongitude");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_RideId_fkey" FOREIGN KEY ("RideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
