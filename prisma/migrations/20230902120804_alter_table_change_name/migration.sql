/*
  Warnings:

  - You are about to drop the `StudenSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudenSubject" DROP CONSTRAINT "StudenSubject_studentRef_fkey";

-- DropForeignKey
ALTER TABLE "StudenSubject" DROP CONSTRAINT "StudenSubject_subjectId_fkey";

-- DropTable
DROP TABLE "StudenSubject";

-- CreateTable
CREATE TABLE "GradeBook" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentRef" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "grade" DOUBLE PRECISION,

    CONSTRAINT "GradeBook_pkey" PRIMARY KEY ("studentRef","subjectId")
);

-- AddForeignKey
ALTER TABLE "GradeBook" ADD CONSTRAINT "GradeBook_studentRef_fkey" FOREIGN KEY ("studentRef") REFERENCES "students"("studentRefCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeBook" ADD CONSTRAINT "GradeBook_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
