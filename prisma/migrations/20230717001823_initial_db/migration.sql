-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `password` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `role` ENUM('ADMIN_SYSTEM', 'ADMIN_COMPANY', 'PROFESSIONAL') NOT NULL DEFAULT 'ADMIN_COMPANY',
    `companyId` VARCHAR(191) NULL,
    `addressId` VARCHAR(191) NULL,
    `appointmentId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_addressId_key`(`addressId`),
    UNIQUE INDEX `User_appointmentId_key`(`appointmentId`),
    INDEX `User_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `stripePriceId` VARCHAR(191) NOT NULL,
    `stripeSubscriptionId` VARCHAR(191) NOT NULL,
    `currentPeriodEnd` INTEGER NOT NULL,
    `currentPeriodStart` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `latestInvoiceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,

    INDEX `Subscription_planId_idx`(`planId`),
    INDEX `Subscription_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `priceInCents` INTEGER NOT NULL,
    `interval` ENUM('month', 'quarter', 'semiannual', 'year') NOT NULL,
    `stripePriceId` VARCHAR(191) NOT NULL,
    `stripeProductId` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `benefits` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `neighborhood` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_addressId_key`(`addressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `daysBeforeCalling` INTEGER NOT NULL,
    `duratioInMinutes` INTEGER NOT NULL,
    `instructions` TEXT NULL,
    `priceInCents` INTEGER NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `appointmentId` VARCHAR(191) NULL,

    INDEX `Service_companyId_idx`(`companyId`),
    INDEX `Service_appointmentId_idx`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `secundaryPhone` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `birthday` DATETIME(3) NULL,
    `gender` ENUM('male', 'famale', 'uninformed') NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Client_addressId_key`(`addressId`),
    INDEX `Client_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `startDateTime` DATETIME(3) NOT NULL,
    `endDateTime` DATETIME(3) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `comment` TEXT NULL,
    `status` ENUM('CREATED', 'PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED', 'ATTENDED', 'MISSED', 'DOCTOR_MISSED') NOT NULL DEFAULT 'CREATED',
    `priceInCents` INTEGER NULL,
    `paid` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Appointment_clientId_idx`(`clientId`),
    INDEX `Appointment_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Historic` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('APPOINTMENT_CREATED', 'APPOINTMENT_CANCELED', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_COMPLETED', 'APPOINTMENT_ATTENDED', 'APPOINTMENT_MISSED', 'APPOINTMENT_DOCTOR_MISSED', 'WHATSAPP_MESSAGE_SENT', 'WHATSAPP_MESSAGE_RECEIVED', 'SMS_MESSAGE_SENT', 'SMS_MESSAGE_RECEIVED', 'MAIL_SENT', 'MAIL_OPENED', 'MAIL_CLICKED_CONFIRMATION', 'MAIL_CLICKED_CANCELATION') NOT NULL,
    `to` VARCHAR(191) NULL,
    `content` TEXT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `appointmentId` VARCHAR(191) NULL,

    INDEX `Historic_appointmentId_idx`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Template` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('WHATSAPP', 'SMS', 'EMAIL') NOT NULL DEFAULT 'WHATSAPP',
    `content` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NULL,

    INDEX `Template_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
