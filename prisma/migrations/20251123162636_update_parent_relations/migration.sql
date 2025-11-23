/*
  Warnings:

  - You are about to drop the column `fatherName` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `motherName` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "fatherName",
DROP COLUMN "motherName",
ADD COLUMN     "fatherId" TEXT,
ADD COLUMN     "motherId" TEXT;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
