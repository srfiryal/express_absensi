const prisma = require("../db/prisma");
const Model = prisma.karyawan;
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schema = Joi.object({
    nama_lengkap: Joi.string().required(),
    email: Joi.string().email().required(),
    nomor_telepon: Joi.string(),
    tanggal_lahir: Joi.date().iso(),
    alamat: Joi.string(),
    tanggal_masuk: Joi.date().iso().required(),
    departemen_id: Joi.number().required(),
    jabatan_id: Joi.number().required(),
    status: Joi.string().valid("aktif", "nonaktif").required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const data = req.body;
      data.tanggal_masuk = new Date(data.tanggal_masuk);
      if (data.tanggal_lahir) data.tanggal_lahir = new Date(data.tanggal_lahir);

      const savedKaryawan = await Model.create({
        data: data,
        include: {
          departemen: {
            select: {
              nama_departemen: true,
            },
          },
          jabatan: {
            select: {
              nama_jabatan: true,
            },
          },
        },
      });

      return res
        .status(200)
        .json(buildResponse(true, "Karyawan dibuat", savedKaryawan));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const getAll = async (req, res) => {
  try {
    const karyawan = await Model.findMany({
      select: {
        id: true,
        nama_lengkap: true,
        email: true,
        departemen: {
          select: {
            nama_departemen: true,
          },
        },
        jabatan: {
          select: {
            nama_jabatan: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return res
      .status(200)
      .json(
        buildResponse(
          true,
          karyawan.length > 0 ? "Karyawan ditemukan" : "Belum ada karyawan",
          karyawan
        )
      );
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const karyawan = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        departemen: {
          select: {
            nama_departemen: true,
          },
        },
        jabatan: {
          select: {
            nama_jabatan: true,
          },
        },
      },
    });

    if (!karyawan) {
      return res
        .status(404)
        .json(buildResponse(false, "Karyawan tidak ditemukan", null));
    }

    return res
      .status(200)
      .json(buildResponse(true, "Karyawan ditemukan", karyawan));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    nama_lengkap: Joi.string().required(),
    email: Joi.string().email().required(),
    nomor_telepon: Joi.string(),
    tanggal_lahir: Joi.date().iso(),
    alamat: Joi.string(),
    tanggal_masuk: Joi.date().iso().required(),
    departemen_id: Joi.number().required(),
    jabatan_id: Joi.number().required(),
    status: Joi.string().valid("aktif", "nonaktif").required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const karyawan = await Model.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!karyawan) {
        return res
          .status(404)
          .json(buildResponse(false, "Karyawan tidak ditemukan", null));
      }

      const data = req.body;

      data.tanggal_masuk = new Date(data.tanggal_masuk);
      if (data.tanggal_lahir) data.tanggal_lahir = new Date(data.tanggal_lahir);

      const updatedKaryawan = await Model.update({
        where: { id: parseInt(req.params.id) },
        data: data,
        include: {
          departemen: {
            select: {
              nama_departemen: true,
            },
          },
          jabatan: {
            select: {
              nama_jabatan: true,
            },
          },
        },
      });

      return res
        .status(200)
        .json(buildResponse(true, "Karyawan diperbarui", updatedKaryawan));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const karyawan = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!karyawan) {
      return res
        .status(404)
        .json(buildResponse(false, "Karyawan tidak ditemukan", null));
    }

    await Model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json(buildResponse(true, "Karyawan dihapus", null));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { create, getAll, getById, update, remove };
