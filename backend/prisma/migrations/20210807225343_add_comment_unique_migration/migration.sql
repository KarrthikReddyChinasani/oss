/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AnotherComment_user_project_key" ON "Comment"("userId", "projectId");
