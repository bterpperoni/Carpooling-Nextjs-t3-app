/*
  Warnings:

  - You are about to drop the column `ArrivalDateTime` on the `Ride` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "ArrivalDateTime",
ADD COLUMN     "arrivalDateTime" TIMESTAMP(3);
