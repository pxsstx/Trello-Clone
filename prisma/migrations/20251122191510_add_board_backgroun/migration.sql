/*
  Warnings:

  - You are about to drop the column `background` on the `boards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boards" DROP COLUMN "background",
ADD COLUMN     "backgroundColor" TEXT,
ADD COLUMN     "backgroundImage" TEXT;
