const jwt = require("jsonwebtoken");
const { buildResponse } = require("../utils/response_util");

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
      if (err) {
        return res.status(403).send(buildResponse(false, err, null));
      }
      req.admin = admin;
      next();
    });
  } else {
    return res.status(401).send(buildResponse(false, "Unauthorized", null));
  }
};

const isSuperadmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
      if (err) {
        console.error(`JWT verification error: ${err.message}`);
        return res.status(403).send(buildResponse(false, "Token tidak valid", null));
      }

      if (admin.username === "superadmin") {
        req.admin = admin;
        next();
      } else {
        return res.status(403).send(buildResponse(false, "Unauthorized", null));
      }
    });
  } else {
    return res.status(401).send(buildResponse(false, "Authorization header missing", null));
  }
};

module.exports = {authentication, isSuperadmin};