/*
  Warnings:

  - You are about to drop the column `has_unpublished_changes` on the `Team_Member_Editables` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Team_Member_Editables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team_Member_Editables" DROP COLUMN "has_unpublished_changes",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
