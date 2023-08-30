/*
  Warnings:

  - Added the required column `userId` to the `parents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userRefCode") ON DELETE RESTRICT ON UPDATE CASCADE;
