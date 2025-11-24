/*
  Warnings:

  - You are about to drop the column `memberId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `financial_transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_memberId_fkey";

-- DropForeignKey
ALTER TABLE "financial_transactions" DROP CONSTRAINT "financial_transactions_memberId_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "memberId",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "financial_transactions" DROP COLUMN "memberId";

-- CreateTable
CREATE TABLE "_FinancialTransactionToMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FinancialTransactionToMember_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentToMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToMember_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FinancialTransactionToMember_B_index" ON "_FinancialTransactionToMember"("B");

-- CreateIndex
CREATE INDEX "_DocumentToMember_B_index" ON "_DocumentToMember"("B");

-- AddForeignKey
ALTER TABLE "_FinancialTransactionToMember" ADD CONSTRAINT "_FinancialTransactionToMember_A_fkey" FOREIGN KEY ("A") REFERENCES "financial_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FinancialTransactionToMember" ADD CONSTRAINT "_FinancialTransactionToMember_B_fkey" FOREIGN KEY ("B") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToMember" ADD CONSTRAINT "_DocumentToMember_A_fkey" FOREIGN KEY ("A") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToMember" ADD CONSTRAINT "_DocumentToMember_B_fkey" FOREIGN KEY ("B") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
