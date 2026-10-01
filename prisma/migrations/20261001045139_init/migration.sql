/*
  Warnings:

  - You are about to drop the column `price` on the `Drink` table. All the data in the column will be lost.
  - You are about to drop the column `drinkId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Size` table. All the data in the column will be lost.
  - Added the required column `drinkSizeId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_drinkId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_sizeId_fkey";

-- AlterTable
ALTER TABLE "Drink" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "drinkId",
DROP COLUMN "sizeId",
ADD COLUMN     "drinkSizeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "DrinkSize" (
    "id" TEXT NOT NULL,
    "drinkId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrinkSize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DrinkSize_drinkId_sizeId_key" ON "DrinkSize"("drinkId", "sizeId");

-- AddForeignKey
ALTER TABLE "DrinkSize" ADD CONSTRAINT "DrinkSize_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "Drink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrinkSize" ADD CONSTRAINT "DrinkSize_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_drinkSizeId_fkey" FOREIGN KEY ("drinkSizeId") REFERENCES "DrinkSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
