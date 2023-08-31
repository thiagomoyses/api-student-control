/*
  Warnings:

  - You are about to drop the `_StudentToSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StudentToSubject" DROP CONSTRAINT "_StudentToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToSubject" DROP CONSTRAINT "_StudentToSubject_B_fkey";

-- DropTable
DROP TABLE "_StudentToSubject";

-- CreateTable
CREATE TABLE "StudenSubject" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentRef" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "StudenSubject_pkey" PRIMARY KEY ("studentRef","subjectId")
);

-- AddForeignKey
ALTER TABLE "StudenSubject" ADD CONSTRAINT "StudenSubject_studentRef_fkey" FOREIGN KEY ("studentRef") REFERENCES "students"("studentRefCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudenSubject" ADD CONSTRAINT "StudenSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
