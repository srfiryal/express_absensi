const prisma = require("../db/prisma");
const Model = prisma.absensi;
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const attendanceIn = async (req, res) => {
  const schema = Joi.object({
    karyawan_id: Joi.number().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const absensi = await Model.findFirst({
        where: {
          karyawan_id: req.body.karyawan_id,
          tanggal: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });

      if (absensi) {
        return res
          .status(400)
          .json(buildResponse(false, "Anda sudah melakukan absen masuk", null));
      }

      const data = {
        karyawan_id: req.body.karyawan_id,
        tanggal: new Date(new Date().setHours(0, 0, 0, 0)),
        waktu_masuk: new Date(),
        status_absensi: "hadir",
      };

      const savedAbsensi = await Model.create({
        data: data,
      });

      return res
        .status(200)
        .json(buildResponse(true, "Absensi masuk disimpan", savedAbsensi));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const attendanceOut = async (req, res) => {
  const schema = Joi.object({
    karyawan_id: Joi.number().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const data = req.body;

      const absensi = await Model.findFirst({
        where: {
          karyawan_id: data.karyawan_id,
          tanggal: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });

      if (!absensi) {
        return res
          .status(404)
          .json(buildResponse(false, "Absensi masuk tidak ditemukan", null));
      }

      if (absensi.waktu_keluar) {
        return res
          .status(400)
          .json(
            buildResponse(false, "Anda sudah melakukan absen keluar", null)
          );
      }

      const updatedAbsensi = await Model.update({
        where: { id: absensi.id },
        data: {
          waktu_keluar: new Date(),
        },
      });

      return res
        .status(200)
        .json(buildResponse(true, "Absensi keluar disimpan", updatedAbsensi));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const create = async (req, res) => {
  const schema = Joi.object({
    karyawan_id: Joi.number().required(),
    tanggal: Joi.date().iso().required(),
    waktu_masuk: Joi.date().iso(),
    waktu_keluar: Joi.date().iso(),
    status_absensi: Joi.string()
      .valid("hadir", "izin", "sakit", "alpha")
      .required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const data = req.body;
      data.tanggal = new Date(data.tanggal);
      data.waktu_masuk = data.waktu_masuk ? new Date(data.waktu_masuk) : null;
      data.waktu_keluar = data.waktu_keluar
        ? new Date(data.waktu_keluar)
        : null;

      const savedAbsensi = await Model.create({
        data: data,
      });

      return res
        .status(200)
        .json(buildResponse(true, "Absensi dibuat", savedAbsensi));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const getAll = async (req, res) => {
  try {
    const absensi = await Model.findMany({
      orderBy: { id: "asc" },
      include: {
        karyawan: {
          select: {
            nama_lengkap: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        buildResponse(
          true,
          absensi.length > 0 ? "Absensi ditemukan" : "Belum ada absensi",
          absensi
        )
      );
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const absensi = await Model.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        karyawan: {
          select: {
            nama_lengkap: true,
          },
        },
      },
    });

    if (!absensi) {
      return res
        .status(404)
        .json(buildResponse(false, "Absensi tidak ditemukan", null));
    }

    return res
      .status(200)
      .json(buildResponse(true, "Absensi ditemukan", absensi));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    karyawan_id: Joi.number().required(),
    tanggal: Joi.date().iso().required(),
    waktu_masuk: Joi.date().iso(),
    waktu_keluar: Joi.date().iso(),
    status_absensi: Joi.string()
      .valid("hadir", "izin", "sakit", "alpha")
      .required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const absensi = await Model.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!absensi) {
        return res
          .status(404)
          .json(buildResponse(false, "Absensi tidak ditemukan", null));
      }

      const data = req.body;
      data.tanggal = new Date(data.tanggal);
      data.waktu_masuk = data.waktu_masuk ? new Date(data.waktu_masuk) : null;
      data.waktu_keluar = data.waktu_keluar
        ? new Date(data.waktu_keluar)
        : null;

      const updatedAbsensi = await Model.update({
        where: { id: parseInt(req.params.id) },
        data: data,
      });

      return res
        .status(200)
        .json(buildResponse(true, "Absensi diperbarui", updatedAbsensi));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const absensi = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!absensi) {
      return res
      .status(404)
      .json(buildResponse(false, "Absensi tidak ditemukan", null));
    }
    
    await Model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json(buildResponse(true, "Absensi dihapus", null));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = {
  attendanceIn,
  attendanceOut,
  create,
  getById,
  update,
  getAll,
  remove,
};
