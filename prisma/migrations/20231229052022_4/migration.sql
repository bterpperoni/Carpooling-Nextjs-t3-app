/*
  Warnings:

  - You are about to drop the column `departureDate` on the `Travel` table. All the data in the column will be lost.
  - You are about to drop the column `destinationDate` on the `Travel` table. All the data in the column will be lost.
  - Added the required column `departureDateTime` to the `Travel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Travel" DROP COLUMN "departureDate",
DROP COLUMN "destinationDate",
ADD COLUMN     "departureDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnDateTime" TIMESTAMP(3);
