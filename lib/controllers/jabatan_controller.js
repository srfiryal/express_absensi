const prisma = require("../db/prisma");
const Model = prisma.jabatan;
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schema = Joi.object({
    nama_jabatan: Joi.string().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const data = req.body;

      const savedJabatan = await Model.create({
        data: data,
      });

      return res
        .status(200)
        .json(buildResponse(true, "Jabatan dibuat", savedJabatan));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const getAll = async (req, res) => {
  try {
    const jabatan = await Model.findMany({ orderBy: { id: "asc" } });

    return res
      .status(200)
      .json(
        buildResponse(
          true,
          jabatan.length > 0 ? "Jabatan ditemukan" : "Belum ada jabatan",
          jabatan
        )
      );
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const jabatan = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!jabatan) {
      return res
        .status(404)
        .json(buildResponse(false, "Jabatan tidak ditemukan", null));
    }

    return res
      .status(200)
      .json(buildResponse(true, "Jabatan ditemukan", jabatan));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    nama_jabatan: Joi.string().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const jabatan = await Model.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!jabatan) {
        return res
          .status(404)
          .json(buildResponse(false, "Jabatan tidak ditemukan", null));
      }

      const data = req.body;

      const updatedJabatan = await Model.update({
        where: { id: parseInt(req.params.id) },
        data: data,
      });

      return res
        .status(200)
        .json(buildResponse(true, "Jabatan diperbarui", updatedJabatan));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const jabatan = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!jabatan) {
      return res
        .status(404)
        .json(buildResponse(false, "Jabatan tidak ditemukan", null));
    }

    await Model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json(buildResponse(true, "Jabatan dihapus", null));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { create, getAll, getById, update, remove };
