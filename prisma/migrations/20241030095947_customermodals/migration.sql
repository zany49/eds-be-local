/*
  Warnings:

  - Made the column `userId` on table `otp` required. This step will fail if there are existing NULL values in that column.
  - Made the column `otp` on table `otp` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `otp` DROP FOREIGN KEY `Otp_userId_fkey`;

-- AlterTable
ALTER TABLE `otp` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `otp` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'EMPLOYEE', 'CUSTOMER') NOT NULL DEFAULT 'USER',
    MODIFY `password` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `contactName` VARCHAR(191) NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `companyEmail` VARCHAR(191) NOT NULL,
    `vatId` VARCHAR(191) NOT NULL,
    `commercialRegId` VARCHAR(191) NOT NULL,
    `mailingAddressId` VARCHAR(191) NULL,
    `pickupMatchesMailing` BOOLEAN NOT NULL DEFAULT false,
    `pickupAddressId` VARCHAR(191) NULL,
    `separateInvoices` BOOLEAN NOT NULL DEFAULT false,
    `contractExpiryDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_mobileNumber_key`(`mobileNumber`),
    UNIQUE INDEX `Customer_companyEmail_key`(`companyEmail`),
    UNIQUE INDEX `Customer_vatId_key`(`vatId`),
    UNIQUE INDEX `Customer_commercialRegId_key`(`commercialRegId`),
    UNIQUE INDEX `Customer_mailingAddressId_key`(`mailingAddressId`),
    UNIQUE INDEX `Customer_pickupAddressId_key`(`pickupAddressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerAddress` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `addressType` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `streetAddress` VARCHAR(191) NOT NULL,
    `additionalAddressInfo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerUserDetails` (
    `id` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `pickupMatchesParent` BOOLEAN NOT NULL DEFAULT false,
    `customerId` VARCHAR(191) NOT NULL,
    `addressType` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `streetAddress` VARCHAR(191) NOT NULL,
    `additionalAddressInfo` VARCHAR(191) NULL,

    UNIQUE INDEX `CustomerUserDetails_mobileNumber_key`(`mobileNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_mailingAddressId_fkey` FOREIGN KEY (`mailingAddressId`) REFERENCES `CustomerAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_pickupAddressId_fkey` FOREIGN KEY (`pickupAddressId`) REFERENCES `CustomerAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerAddress` ADD CONSTRAINT `CustomerAddress_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerUserDetails` ADD CONSTRAINT `CustomerUserDetails_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
