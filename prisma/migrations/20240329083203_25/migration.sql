/*
  Warnings:

  - The values [PENDING] on the enum `RideStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RideStatus_new" AS ENUM ('CREATED', 'UPDATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Ride" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ride" ALTER COLUMN "status" TYPE "RideStatus_new" USING ("status"::text::"RideStatus_new");
ALTER TYPE "RideStatus" RENAME TO "RideStatus_old";
ALTER TYPE "RideStatus_new" RENAME TO "RideStatus";
DROP TYPE "RideStatus_old";
ALTER TABLE "Ride" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "status" SET DEFAULT 'CREATED';
