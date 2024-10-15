const prisma = require("../db/prisma");
const Model = prisma.gaji;
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schema = Joi.object({
    karyawan_id: Joi.number().required(),
    bulan: Joi.string().required(),
    gaji_pokok: Joi.number().required(),
    tunjangan: Joi.number(),
    potongan: Joi.number(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const data = req.body;
      data.tunjangan = data.tunjangan || 0;
      data.potongan = data.potongan || 0;
      data.total_gaji = data.gaji_pokok + data.tunjangan - data.potongan;

      const savedGaji = await Model.create({
        data: data,
        include: {
          karyawan: {
            select: {
              nama_lengkap: true,
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
          },
        },
      });

      return res
        .status(200)
        .json(buildResponse(true, "Gaji dibuat", savedGaji));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const getAll = async (req, res) => {
  try {
    const gaji = await Model.findMany({
      include: {
        karyawan: {
          select: {
            nama_lengkap: true,
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
        },
      },
      orderBy: { id: "desc" },
    });

    return res
      .status(200)
      .json(
        buildResponse(
          true,
          gaji.length > 0 ? "Gaji ditemukan" : "Belum ada gaji",
          gaji
        )
      );
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const gaji = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        karyawan: {
          select: {
            nama_lengkap: true,
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
        },
      },
    });

    if (!gaji) {
      return res
        .status(404)
        .json(buildResponse(false, "Gaji tidak ditemukan", null));
    }

    return res.status(200).json(buildResponse(true, "Gaji ditemukan", gaji));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    karyawan_id: Joi.number().required(),
    bulan: Joi.string().required(),
    gaji_pokok: Joi.number().required(),
    tunjangan: Joi.number(),
    potongan: Joi.number(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const gaji = await Model.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!gaji) {
        return res
          .status(404)
          .json(buildResponse(false, "Gaji tidak ditemukan", null));
      }

      const data = req.body;
      data.tunjangan = data.tunjangan || 0;
      data.potongan = data.potongan || 0;
      data.total_gaji = data.gaji_pokok + data.tunjangan - data.potongan;

      const updatedGaji = await Model.update({
        where: { id: parseInt(req.params.id) },
        data: data,
        include: {
          karyawan: {
            select: {
              nama_lengkap: true,
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
          },
        },
      });

      return res
        .status(200)
        .json(buildResponse(true, "Gaji diperbarui", updatedGaji));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const gaji = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!gaji) {
      return res
        .status(404)
        .json(buildResponse(false, "Gaji tidak ditemukan", null));
    }

    await Model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json(buildResponse(true, "Gaji dihapus", null));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { create, getAll, getById, update, remove };
