const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const UserPermission = db.UserPermissions;
const User = db.user;
const bcrypt = require("bcryptjs");

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
        id: tokenData.id,
      },
    });

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
      return res
        .status(401)
        .send({ success: false, message: "User token not matched!" });
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

verifyAISecretKey = async (req, res, next) => {
  try {
    let aiSecretKey = req.headers["ai-secret-key"];

    if (!aiSecretKey) {
      return res
        .status(401)
        .send({ success: false, message: "AI secret key not provided!" });
    }

    const isValidAISecretKey = bcrypt.compareSync(
      config.aiReportSecret,
      aiSecretKey
    );

    if (!isValidAISecretKey) {
      return res
        .status(401)
        .send({ success: false, message: "AI secret key does not matched!" });
    }
    next();
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

    return res.status(400).send({
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

    return res.status(400).send({
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

    return res.status(400).send({
      message: "You don't have permission to access this module!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Support or Admin role!",
    });
  }
};

isTeacher = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "teacher") {
        return next();
      }
    }

    return res.status(400).send({
      message: `You don't have permission to access this module!`,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isSupportOrAdminOrTeacher = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    console.log(roles);
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "support") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
      if (roles[i].name === "teacher") {
        return next();
      }
      if (roles[i].name === "university") {
        return next();
      }
    }

    return res.status(400).send({
      message: "You don't have permission to access this module!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Support or Admin or Teacher role!",
    });
  }
};

checkUserAddPermission = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided!",
      });
    }

    const tokenData = jwt.decode(token);
    const user = await User.findByPk(tokenData.id);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }
    const userAccess = await UserPermission.findOne({
      where: {
        userId: tokenData.id,
      },
    });

    if (!userAccess) {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }

    if (userAccess.isAdd == "1") {
      return next();
    } else {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

checkUserUpdatePermission = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided!",
      });
    }

    const tokenData = jwt.decode(token);

    const user = await User.findByPk(tokenData.id);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    const userAccess = await UserPermission.findOne({
      where: {
        userId: tokenData.id,
      },
    });

    if (!userAccess) {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }

    if (userAccess.isUpdate == "1") {
      return next();
    } else {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

checkUserReadPermission = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided!",
      });
    }

    const tokenData = jwt.decode(token);

    const user = await User.findByPk(tokenData.id);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    const userAccess = await UserPermission.findOne({
      where: {
        userId: tokenData.id,
      },
    });

    if (!userAccess) {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }

    if (userAccess.isRead == "1") {
      return next();
    } else {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

checkUserDeletePermission = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided!",
      });
    }

    const tokenData = jwt.decode(token);

    const user = await User.findByPk(tokenData.id);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    const userAccess = await UserPermission.findOne({
      where: {
        userId: tokenData.id,
      },
    });

    if (!userAccess) {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }

    if (userAccess.isDelete == "1") {
      return next();
    } else {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

checkUserUpdateStatusPermission = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided!",
      });
    }

    const tokenData = jwt.decode(token);
    const user = await User.findByPk(tokenData.id);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    const userAccess = await UserPermission.findOne({
      where: {
        userId: tokenData.id,
      },
    });

    if (!userAccess) {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }

    if (userAccess.isStatus == "1") {
      return next();
    } else {
      return res.status(400).send({
        success: false,
        message: "You don't have permission to access this module.",
      });
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

const authJwt = {
  verifyToken,
  verifyAISecretKey,
  isAdmin,
  isSupport,
  isSupportOrAdmin,
  isTeacher,
  isSupportOrAdminOrTeacher,
  checkUserAddPermission,
  checkUserUpdatePermission,
  checkUserReadPermission,
  checkUserDeletePermission,
  checkUserUpdateStatusPermission,
};
module.exports = authJwt;
