/*
  Warnings:

  - You are about to alter the column `username` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `password` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "gaji" ALTER COLUMN "tunjangan" SET DEFAULT 0,
ALTER COLUMN "potongan" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "karyawan" ALTER COLUMN "nomor_telepon" DROP NOT NULL,
ALTER COLUMN "tanggal_lahir" DROP NOT NULL,
ALTER COLUMN "alamat" DROP NOT NULL;
