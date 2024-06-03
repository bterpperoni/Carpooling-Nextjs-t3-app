/*
  Warnings:

  - Added the required column `type` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RIDE', 'WALLET', 'GROUP', 'USER');

-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "type" "NotificationType" NOT NULL;
