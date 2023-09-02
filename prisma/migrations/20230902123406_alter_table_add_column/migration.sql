/*
  Warnings:

  - Added the required column `userId` to the `GradeBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GradeBook" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GradeBook" ADD CONSTRAINT "GradeBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userRefCode") ON DELETE RESTRICT ON UPDATE CASCADE;
