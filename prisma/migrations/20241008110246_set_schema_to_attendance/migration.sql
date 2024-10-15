-- CreateTable
CREATE TABLE "absensi" (
    "id" SERIAL NOT NULL,
    "karyawan_id" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "waktu_masuk" TIMESTAMP(6) NOT NULL,
    "waktu_keluar" TIMESTAMP(6) NOT NULL,
    "status_absensi" VARCHAR(10) NOT NULL,

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departemen" (
    "id" SERIAL NOT NULL,
    "nama_departemen" VARCHAR(255) NOT NULL,

    CONSTRAINT "departemen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gaji" (
    "id" SERIAL NOT NULL,
    "karyawan_id" INTEGER NOT NULL,
    "bulan" VARCHAR(50) NOT NULL,
    "gaji_pokok" DOUBLE PRECISION NOT NULL,
    "tunjangan" DOUBLE PRECISION NOT NULL,
    "potongan" DOUBLE PRECISION NOT NULL,
    "total_gaji" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "gaji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jabatan" (
    "id" SERIAL NOT NULL,
    "nama_jabatan" VARCHAR(255) NOT NULL,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "karyawan" (
    "id" SERIAL NOT NULL,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nomor_telepon" VARCHAR(20) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "alamat" TEXT NOT NULL,
    "tanggal_masuk" DATE NOT NULL,
    "departemen_id" INTEGER NOT NULL,
    "jabatan_id" INTEGER NOT NULL,
    "status" VARCHAR(10) NOT NULL,

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_email_key" ON "karyawan"("email");

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "karyawan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gaji" ADD CONSTRAINT "gaji_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "karyawan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_departemen_id_fkey" FOREIGN KEY ("departemen_id") REFERENCES "departemen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_jabatan_id_fkey" FOREIGN KEY ("jabatan_id") REFERENCES "jabatan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
