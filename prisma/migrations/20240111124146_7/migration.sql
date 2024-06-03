/*
  Warnings:

  - The `visibility` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "visibility",
ADD COLUMN     "visibility" BOOLEAN NOT NULL DEFAULT false;
