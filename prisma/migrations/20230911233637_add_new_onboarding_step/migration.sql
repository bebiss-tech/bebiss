-- AlterTable
ALTER TABLE `Onboarding` MODIFY `step` ENUM('WELCOME', 'CREATE_COMPANY', 'UPGRADE', 'CONNECT_WHATSAPP', 'CONNECT_WHATSAPP_CONNECTED', 'CONNECT_CALENDAR', 'COMPLETE_SETUP') NOT NULL DEFAULT 'WELCOME';
