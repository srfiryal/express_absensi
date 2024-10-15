const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
router.use('/admin', adminRouter);

const karyawanRouter = require('./karyawan');
router.use('/karyawan', karyawanRouter);

const departemenRouter = require('./departemen');
router.use('/departemen', departemenRouter);

const jabatanRouter = require('./jabatan');
router.use('/jabatan', jabatanRouter);

const absensiRouter = require('./absensi');
router.use('/absensi', absensiRouter);

const gajiRouter = require('./gaji');
router.use('/gaji', gajiRouter);

module.exports = router;