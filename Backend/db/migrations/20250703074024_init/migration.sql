-- CreateTable
CREATE TABLE "MedTrack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "destination" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "MedTrack_pkey" PRIMARY KEY ("id")
);
