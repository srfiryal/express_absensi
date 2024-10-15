/*
  Warnings:

  - Added the required column `updated_at` to the `absensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `departemen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `gaji` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `jabatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `karyawan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "absensi" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "departemen" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "gaji" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "jabatan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "karyawan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
