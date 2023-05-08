const db = require("../models");
const Category = db.category;
const User = db.user;
const Role = db.role;
const pagination = require("../middleware/pagination");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");

exports.createCategory = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const roleId = decodeToken.id;
    const roleExist = await User.findOne({
      where: {
        id: roleId,
      },
    });
    const roles = await roleExist.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name != "admin" && roles[i].name != "support") {
        return res.status(400).send({
          status: false,
          message: `You don't have permission to access this module!`,
        });
      }
    }

    if (!req.body.categoryName) {
      return res.status(400).send({
        status: false,
        message: `Please enter category name!`,
      });
    } else if (!req.body.status) {
      return res.status(400).send({
        status: false,
        message: `Please select status!`,
      });
    } else if (req.body.status != "0" && req.body.status != "1") {
      return res.status(400).send({
        status: false,
        message: `Please select valid status!`,
      });
    }

    const categoryExist = await Category.findOne({
      where: {
        categoryName: req.body.categoryName,
      },
    });

    if (categoryExist) {
      return res
        .status(400)
        .send({ status: false, message: "Category already exist" });
    }

    const response = await Category.create({
      categoryName: req.body.categoryName,
      status: req.body.status,
    });
    return res
      .status(200)
      .send({ status: true, message: "created successfully", response });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const roleId = decodeToken.id;
    const roleExist = await User.findOne({
      where: {
        id: roleId,
      },
    });
    const roles = await roleExist.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (
        roles[i].name != "admin" &&
        roles[i].name != "support" &&
        roles[i].name != "student"
      ) {
        return res.status(400).send({
          status: false,
          message: `You don't have permission to access this module!`,
        });
      }
    }

    const response = await Category.findOne({
      where: {
        id: req.params.categoryId,
      },
    });
    if (!response) {
      return res.status(200).send({
        status: false,
        message: "Category not found",
        data: response?.length > 0 ? response : [],
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "Category found successfully", response });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const roleId = decodeToken.id;
    const roleExist = await User.findOne({
      where: {
        id: roleId,
      },
    });
    const roles = await roleExist.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (
        roles[i].name != "admin" &&
        roles[i].name != "support" &&
        roles[i].name != "student"
      ) {
        return res.status(400).send({
          status: false,
          message: `You don't have permission to access this module!`,
        });
      }
    }

    const results = await Category.findAll({
      where: {
        status: "1",
      },
      // order: [["id", "DESC"]],
    });

    if (results?.length == 0) {
      return res.status(200).send({
        status: false,
        message: "Category not found",
        data: response,
      });
    }
    return res.status(200).send({
      status: true,
      message: "Category found successfully",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.updateCategoryStatus = async (req, res) => {
  try {
    const data = req.body;
    const { status } = data;

    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const roleId = decodeToken.id;
    const roleExist = await User.findOne({
      where: {
        id: roleId,
      },
    });
    const roles = await roleExist.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name != "admin" && roles[i].name != "support") {
        return res.status(400).send({
          status: false,
          message: `You don't have permission to access this module!`,
        });
      }
    }

    if (!status) {
      return res
        .status(400)
        .send({ status: false, msg: "Please select status " });
    } else if (status != "0" && status != "1") {
      return res
        .status(400)
        .send({ status: false, msg: "Please select status 0 or 1" });
    }
    const existCategory = await Category.findOne({
      where: {
        id: req.params.categoryId,
      },
    });
    if (!existCategory) {
      return res
        .status(404)
        .send({ status: false, message: "Category not found" });
    }
    if (status == "1") {
      const response = await Category.update(
        {
          status: status,
        },
        {
          where: { id: req.params.categoryId },
        }
      );
      return res.status(200).send({
        status: true,
        message: "Status has been enabled",
      });
    } else {
      const responce = await Category.update(
        {
          status: status,
        },
        {
          where: { id: req.params.categoryId },
        }
      );
      return res.status(200).send({
        status: true,
        message: "Status has been disabled",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const data = req.body;
    const { status, categoryName } = data;

    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const roleId = decodeToken.id;
    const roleExist = await User.findOne({
      where: {
        id: roleId,
      },
    });
    const roles = await roleExist.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name != "admin" && roles[i].name != "support") {
        return res.status(400).send({
          status: false,
          message: `You don't have permission to access this module!`,
        });
      }
    }
    if (!categoryName) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter category name!" });
    }

    if (!status) {
      return res
        .status(400)
        .send({ status: false, msg: "Please select status! " });
    } else if (status != "0" && status != "1") {
      return res
        .status(400)
        .send({ status: false, msg: "Please select status 0 or 1" });
    }
    const existCategory = await Category.findOne({
      where: {
        id: req.params.categoryId,
      },
    });
    if (!existCategory) {
      return res
        .status(404)
        .send({ status: false, message: "Category not found!" });
    }

    const response = await Category.update(
      {
        categoryName: categoryName,
        status: status,
      },
      {
        where: { id: req.params.categoryId },
      }
    );
    return res.status(200).send({
      status: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const token = req.headers["x-access-token"];
  const decodeToken = jwt.decode(token);
  const roleId = decodeToken.id;
  const roleExist = await User.findOne({
    where: {
      id: roleId,
    },
  });
  const roles = await roleExist.getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name != "admin" && roles[i].name != "support") {
      return res.status(400).send({
        status: false,
        message: `You don't have permission to access this module!`,
      });
    }
  }
  const existCategory = await Category.findOne({
    where: {
      id: req.params.categoryId,
    },
  });
  if (!existCategory) {
    return res
      .status(404)
      .send({ status: false, message: "Category not found" });
  }

  const response = await Category.destroy({
    where: {
      id: req.params.categoryId,
    },
  });
  return res.status(200).send({
    status: true,
    message: "Category deleted successfully",
  });
};
