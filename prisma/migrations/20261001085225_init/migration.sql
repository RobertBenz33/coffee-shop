/*
  Warnings:

  - You are about to drop the column `drinkSizeId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `ingredientId` on the `OrderItemIngredient` table. All the data in the column will be lost.
  - Added the required column `drinkName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientName` to the `OrderItemIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientType` to the `OrderItemIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_drinkSizeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemIngredient" DROP CONSTRAINT "OrderItemIngredient_ingredientId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "drinkSizeId",
ADD COLUMN     "drinkName" TEXT NOT NULL,
ADD COLUMN     "sizeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItemIngredient" DROP COLUMN "ingredientId",
ADD COLUMN     "ingredientName" TEXT NOT NULL,
ADD COLUMN     "ingredientType" "IngredientType" NOT NULL;
