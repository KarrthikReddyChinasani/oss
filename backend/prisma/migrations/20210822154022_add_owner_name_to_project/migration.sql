/*
  Warnings:

  - You are about to drop the column `project_id` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project.project_id_unique";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "project_id",
ADD COLUMN     "ownerName" TEXT NOT NULL DEFAULT E'name',
ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project.projectId_unique" ON "Project"("projectId");
