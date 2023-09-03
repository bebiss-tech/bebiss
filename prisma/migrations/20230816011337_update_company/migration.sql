/*
  Warnings:

  - You are about to drop the column `stripeId` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Company_stripeId_key` ON `Company`;

-- AlterTable
ALTER TABLE `Company` DROP COLUMN `stripeId`,
    ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `stripePriceId` VARCHAR(191) NULL,
    ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_stripeCustomerId_key` ON `Company`(`stripeCustomerId`);

-- CreateIndex
CREATE UNIQUE INDEX `Company_stripeSubscriptionId_key` ON `Company`(`stripeSubscriptionId`);
