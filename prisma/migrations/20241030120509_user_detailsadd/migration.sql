/*
  Warnings:

  - You are about to drop the column `addressType` on the `customeruserdetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customeruserdetails` DROP COLUMN `addressType`,
    MODIFY `country` VARCHAR(191) NULL,
    MODIFY `state` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `streetAddress` VARCHAR(191) NULL;
