const prisma = require("../db/prisma");
const Model = prisma.admin;
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { buildResponse } = require("../utils/response_util");

const login = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    kata_sandi: Joi.string().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const data = req.body;
      const admin = await Model.findUnique({
        where: {
          username: data.username,
        },
      });

      if (!admin) {
        return res
          .status(404)
          .json(buildResponse(false, "Akun tidak ditemukan", null));
      }

      console.log("admin", admin);

      const isPasswordMatch = await bcrypt.compare(
        admin.kata_sandi,
        data.kata_sandi
      );

      if (isPasswordMatch) {
        return res
          .status(400)
          .json(buildResponse(false, "Kata sandi salah", null));
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET
      );

      const adminToken = { ...admin, token };
      delete adminToken.kata_sandi;

      return res
        .status(200)
        .json(buildResponse(true, "Login berhasil", adminToken));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const create = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    kata_sandi: Joi.string().required(),
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
      data.kata_sandi = await bcrypt.hash(data.kata_sandi, 10);

      const savedAdmin = await Model.create({
        data: data,
        include: {
          karyawan: {
            select: {
              nama_lengkap: true,
            },
          },
        },
      });

      delete savedAdmin.kata_sandi;

      return res
        .status(200)
        .json(buildResponse(true, "Admin dibuat", savedAdmin));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    kata_sandi: Joi.string().required(),
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
      const admin = await Model.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!admin) {
        return res
          .status(404)
          .json(buildResponse(false, "Akun tidak ditemukan", null));
      }

      data.kata_sandi = await bcrypt.hash(data.kata_sandi, 10);

      const savedAdmin = await Model.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: data,
        include: {
          karyawan: {
            select: {
              nama_lengkap: true,
            },
          },
        },
      });

      delete savedAdmin.kata_sandi;

      return res
        .status(200)
        .json(buildResponse(true, "Admin diperbarui", savedAdmin));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const updateMe = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    kata_sandi_lama: Joi.string().required(),
    kata_sandi_baru: Joi.string().required(),
  });

  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).send(buildResponse(false, "Authorization header missing", null));
      }

      const token = authHeader.split(" ")[1];
    
      jwt.verify(token, process.env.JWT_SECRET, async (err, admin) => {
        if (err) {
          console.error(`JWT verification error: ${err.message}`);
          return res.status(403).send(buildResponse(false, "Token tidak valid", null));
        }

        const data = req.body;
        const findAdmin = await Model.findUnique({
          where: {
            id: parseInt(admin.id),
          },
        });

        if (!findAdmin) {
          return res
            .status(404)
            .json(buildResponse(false, "Akun tidak ditemukan", null));
        }
  
        const isPasswordMatch = await bcrypt.compare(
          data.kata_sandi_lama,
          findAdmin.kata_sandi
        );
    
        if (!isPasswordMatch) {
          return res
            .status(400)
            .json(buildResponse(false, "Kata sandi lama salah", null));
        }
  
        data.kata_sandi = await bcrypt.hash(data.kata_sandi_baru, 10);
        delete data.kata_sandi_lama;
        delete data.kata_sandi_baru;
  
        const savedAdmin = await Model.update({
          where: {
            id: admin.id,
          },
          data: data,
          include: {
            karyawan: {
              select: {
                nama_lengkap: true,
              },
            },
          },
        });
  
        delete savedAdmin.kata_sandi;
  
        return res
          .status(200)
          .json(buildResponse(true, "Admin diperbarui", savedAdmin));  
      });
      } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const getAll = async (req, res) => {
  try {
    const admin = await Model.findMany({
      select: {
        id: true,
        username: true,
        karyawan_id: true,
        created_at: true,
        updated_at: true,
        karyawan: {
          select: {
            nama_lengkap: true,
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
          admin.length > 0 ? "Admin ditemukan" : "Belum ada admin",
          admin
        )
      );
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const admin = await Model.findUnique({
      select: {
        id: true,
        username: true,
        karyawan_id: true,
        created_at: true,
        updated_at: true,
        karyawan: {
          select: {
            nama_lengkap: true,
          },
        },
      },
      where: { id: parseInt(req.params.id) },
    });

    if (!admin) {
      return res
        .status(404)
        .json(buildResponse(false, "Admin tidak ditemukan", null));
    }

    return res.status(200).json(buildResponse(true, "Admin ditemukan", admin));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getMe = async (req, res) => {
  const isValid = schema.validate(req.body);
  if (isValid.error) {
    return res
      .status(400)
      .json(buildResponse(false, isValid.error.message, null));
  } else {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).send(buildResponse(false, "Authorization header missing", null));
      }

      const token = authHeader.split(" ")[1];
    
      jwt.verify(token, process.env.JWT_SECRET, async (err, admin) => {
        if (err) {
          console.error(`JWT verification error: ${err.message}`);
          return res.status(403).send(buildResponse(false, "Token tidak valid", null));
        }

        console.log("admin", admin);

        const findAdmin = await Model.findUnique({
          where: {
            id: parseInt(admin.id),
          },
        });

        if (!findAdmin) {
          return res
            .status(404)
            .json(buildResponse(false, "Akun tidak ditemukan", null));
        }
  
        return res
          .status(200)
          .json(buildResponse(true, "Admin ditemukan", findAdmin));  
      });
      } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const admin = await Model.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!admin) {
      return res
        .status(404)
        .json(buildResponse(false, "Admin tidak ditemukan", null));
    }

    await Model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json(buildResponse(true, "Admin dihapus", null));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { login, create, getAll, getById, getMe, update, updateMe, remove };
