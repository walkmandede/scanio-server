/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorId,name]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vendorId,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vendorId,brandId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vendorId,categoryId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vendorId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "sortOrder";

-- CreateIndex
CREATE UNIQUE INDEX "Brand_vendorId_name_key" ON "Brand"("vendorId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_vendorId_name_key" ON "Category"("vendorId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_brand_vendor_guard" ON "Product"("vendorId", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_vendor_guard" ON "Product"("vendorId", "categoryId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
