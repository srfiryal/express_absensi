const prisma = require("../db/prisma");
const Model = prisma.departemen;
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schema = Joi.object({
    nama_departemen: Joi.string().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const data = req.body;

      const savedDepartemen = await Model.create({
        data: data,
      });

      return res
        .status(200)
        .json(buildResponse(true, "Departemen dibuat", savedDepartemen));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const getAll = async (req, res) => {
  try {
    const departemen = await Model.findMany({ orderBy: { id: "asc" } });

    return res
      .status(200)
      .json(
        buildResponse(
          true,
          departemen.length > 0
            ? "Departemen ditemukan"
            : "Belum ada departemen",
          departemen
        )
      );
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const departemen = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!departemen) {
      return res
      .status(404)
      .json(buildResponse(false, "Departemen tidak ditemukan", null));
    }
    
    return res
    .status(200)
    .json(buildResponse(true, "Departemen ditemukan", departemen));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    nama_departemen: Joi.string().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const departemen = await Model.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!departemen) {
        return res
          .status(404)
          .json(buildResponse(false, "Departemen tidak ditemukan", null));
      }

      const data = req.body;

      const updatedDepartemen = await Model.update({
        where: { id: parseInt(req.params.id) },
        data: data,
      });

      return res
        .status(200)
        .json(buildResponse(true, "Departemen diperbarui", updatedDepartemen));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const departemen = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!departemen) {
      return res
        .status(404)
        .json(buildResponse(false, "Departemen tidak ditemukan", null));
    }

    await Model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "Departemen dihapus", null));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { create, getAll, getById, update, remove };
