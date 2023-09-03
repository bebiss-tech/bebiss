/*
  Warnings:

  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Company` ADD COLUMN `billingCycleStart` INTEGER NULL,
    ADD COLUMN `plan` ENUM('free', 'pro') NOT NULL DEFAULT 'free',
    ADD COLUMN `stripeId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Subscription`;

-- CreateIndex
CREATE UNIQUE INDEX `Company_stripeId_key` ON `Company`(`stripeId`);
