const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({
        message: "No token provided!",
      });
    }

    const tokenData = jwt.decode(token);

    const user = await User.findOne({
      where: {
        id: tokenData.id
      }
    })

    if (user.tokenKey == token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
        req.userId = decoded.id;
        next();
      });
    } else {
      return res.status(401).send({ success: false, message: "User token not matched!" });
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isSupport = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "support") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Support Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate support role!",
    });
  }
};

isSupportOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "support") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Support or Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Support or Admin role!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSupport,
  isSupportOrAdmin,
};
module.exports = authJwt;
