/*
  Warnings:

  - Made the column `arrivalDateTime` on table `Ride` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "maxDetourDist" DROP NOT NULL,
ALTER COLUMN "arrivalDateTime" SET NOT NULL;
