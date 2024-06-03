-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CREATED', 'UPDATED', 'CHECKED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'CREATED';
