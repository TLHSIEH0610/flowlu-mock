/*
  Warnings:

  - You are about to drop the column `status` on the `Ticket` table. All the data in the column will be lost.
  - The `priority` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `name` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'normal', 'high');

-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('todo', 'inprogress', 'done', 'accepted');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('task', 'bug', 'story', 'change');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "name" "CategoryName" NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "status",
DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" DEFAULT 'low',
DROP COLUMN "type",
ADD COLUMN     "type" "TicketType" DEFAULT 'task';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
