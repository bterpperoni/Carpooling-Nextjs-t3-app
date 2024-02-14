-- DropForeignKey
ALTER TABLE "Travel" DROP CONSTRAINT "Travel_driverId_fkey";

-- AddForeignKey
ALTER TABLE "Travel" ADD CONSTRAINT "Travel_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
