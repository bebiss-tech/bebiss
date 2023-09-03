/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Onboarding` table. All the data in the column will be lost.
  - The values [COMPLETE_REGISTRATION,CALENDAR,COMPANY,SERVICES,CLIENTS,APPOINTMENTS] on the enum `Onboarding_step` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Onboarding` DROP COLUMN `completedAt`,
    MODIFY `step` ENUM('WELCOME', 'CREATE_COMPANY', 'UPGRADE', 'CONECT_WHATSAPP', 'CONECT_CALENDAR', 'COMPLETE_SETUP') NOT NULL DEFAULT 'WELCOME';

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('ADMIN_SYSTEM', 'ADMIN_COMPANY', 'MEMBER_COMPANY', 'PROFESSIONAL') NOT NULL DEFAULT 'ADMIN_COMPANY';
