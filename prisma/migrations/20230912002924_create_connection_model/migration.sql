-- CreateTable
CREATE TABLE `Connection` (
    `id` VARCHAR(191) NOT NULL,
    `uuid` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NULL,
    `status` ENUM('init', 'connected', 'disconnected') NOT NULL DEFAULT 'init',
    `companyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Connection_uuid_key`(`uuid`),
    UNIQUE INDEX `Connection_companyId_key`(`companyId`),
    INDEX `Connection_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
