/*
  Warnings:

  - You are about to drop the column `registrationNumber` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentRefCode]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentRefCode` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "registrationNumber",
ADD COLUMN     "studentRefCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_studentRefCode_key" ON "students"("studentRefCode");
