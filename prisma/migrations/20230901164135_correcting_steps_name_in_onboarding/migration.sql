/*
  Warnings:

  - The values [CONECT_WHATSAPP,CONECT_CALENDAR] on the enum `Onboarding_step` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Onboarding` MODIFY `step` ENUM('WELCOME', 'CREATE_COMPANY', 'UPGRADE', 'CONNECT_WHATSAPP', 'CONNECT_CALENDAR', 'COMPLETE_SETUP') NOT NULL DEFAULT 'WELCOME';
