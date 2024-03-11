-- AlterTable
ALTER TABLE "PaypalTransaction" ALTER COLUMN "orderId" DROP NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "balance" SET DEFAULT '0',
ALTER COLUMN "balance" SET DATA TYPE TEXT;
