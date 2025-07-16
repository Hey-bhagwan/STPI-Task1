/*
  Warnings:

  - You are about to drop the column `destination` on the `MedTrack` table. All the data in the column will be lost.
  - Added the required column `address` to the `MedTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `MedTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `MedTrack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedTrack" DROP COLUMN "destination",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
