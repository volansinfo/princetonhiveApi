const db = require("../models");
const Library = db.library;
const User = db.user;
const Role = db.role;
const Category = db.category;
const pagination = require("../middleware/pagination");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const uploadFile = require("../middleware/fileUpload");
const sharp = require("sharp");
exports.createLibrary = async (req, res) => {
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

    await uploadFile(req, res);
    if (!req.body.title) {
      return res.status(400).send({
        status: false,
        message: `Please enter title!`,
      });
    } else if (!req.body.categoryId) {
      return res.status(400).send({
        status: false,
        message: `Please enter category id!`,
      });
    } else if (!req.body.bookUrl) {
      return res.status(400).send({
        status: false,
        message: `Please enter book url!`,
      });
    } else if (req.file == undefined) {
      return res.status(400).send({
        success: false,
        message: "Please Upload file",
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
    // console.log(req.file.size);
    const fileType = req.file.originalname.split(".")[1];
    if (fileType != "jpg" && fileType != "jpeg" && fileType != "png") {
      return res.status(400).send({
        success: false,
        message: "Please Upload file jpg,png,jpeg file",
      });
    }
    // if (req.file.size > 1024 * 1024 * 1024 * 1024) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Please Upload file less 4mb",
    //   });
    // }
    // console.log(req.file.originalname.split(" ").join(""));
    const findLastEntry = await Library.findAll({
      order: [["id", "DESC"]],
    });
    // console.log(findLastEntry[0].id);
    const fileName = req.file.originalname.split(".")[1];
    const newFilename = `${Date.now()}${
      findLastEntry[0]?.id ? findLastEntry[0]?.id : 0
    }.${fileName}`;

    // const filePath1 = newFilename.split("(").join("");
    // const filePath = filePath1.split(")").join("");
    // console.log(req.file, "knkdsfaskjhnk");
    await sharp(req.file.buffer)
      .resize({ width: 413, height: 269 })
      .toFile(__basedir + "/uploads/fileUpload/" + newFilename);

    const existTitle = await Library.findOne({
      where: {
        title: req.body.title,
      },
    });
    if (existTitle) {
      return res.status(400).send({
        success: false,
        message: "Library already exist",
      });
    }

    const existCategory = await Category.findOne({
      where: {
        id: req.body.categoryId,
      },
    });
    if (!existCategory) {
      return res.status(400).send({
        success: false,
        message: "Category id does not exist",
      });
    }

    const response = await Library.create({
      title: req.body.title,
      categoryId: req.body.categoryId,
      bookUrl: req.body.bookUrl,
      fileUpload: newFilename,
      status: req.body.status,
    });
    return res
      .status(200)
      .send({ status: true, message: "created successfully", response });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.getLibraryById = async (req, res) => {
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

    const response = await Library.findOne({
      where: {
        id: req.params.libraryId,
      },
    });
    if (!response) {
      return res.status(200).send({
        status: false,
        message: "Library not found",
        data: response?.length > 0 ? response : [],
      });
    }

    // console.log(req.protocol + "://" + req.get("host"));

    // console.log(response);
    const fullUrl =
      req.protocol + "://" + req.get("host") + "/princetonhive/img/fileUpload/";

    const result = {
      id: response?.id,
      title: response?.title,
      bookUrl: response?.bookUrl,
      fileUpload: fullUrl + response?.fileUpload,
      categoryId: response?.categoryId,
      status: response?.status,
      createdAt: response?.createdAt,
      updatedAt: response?.updatedAt,
    };

    return res
      .status(200)
      .send({ status: true, message: "Library found successfully", result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.getAllLibrary = async (req, res) => {
  try {
    const data = [];
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
    const fullUrl =
      req.protocol + "://" + req.get("host") + "/princetonhive/img/fileUpload/";
    const results = await Library.findAll({
      where: {
        status: "1",
      },
      order: [["id", "DESC"]],
    });
    for (let i = 0; i < results.length; i++) {
      data.push({
        id: results[i]?.id,
        title: results[i]?.title,
        bookUrl: results[i]?.bookUrl,
        fileUpload: fullUrl + results[i]?.fileUpload,
        categoryId: results[i]?.categoryId,
        status: results[i]?.status,
        createdAt: results[i]?.createdAt,
        updatedAt: results[i]?.updatedAt,
      });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = 12;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const responce = {};
    responce.dataItems = data.slice(startIndex, endIndex);
    responce.totalItems = data.length;
    responce.currentPage = parseInt(req.query.page) || 0;
    responce.totalPages = Math.ceil(data.length / limit);
    if (responce.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "Library not found",
        data: responce,
      });
    }
    return res.status(200).send({
      status: true,
      message: "Library found successfully",
      data: responce,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.updateLibraryStatus = async (req, res) => {
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
    const existLibrary = await Library.findOne({
      where: {
        id: req.params.libraryId,
      },
    });
    if (!existLibrary) {
      return res
        .status(404)
        .send({ status: false, message: "Library not found" });
    }
    if (status == "1") {
      const response = await Library.update(
        {
          status: status,
        },
        {
          where: { id: req.params.libraryId },
        }
      );
      return res.status(200).send({
        status: true,
        message: "Status has been enabled",
      });
    } else {
      const responce = await Library.update(
        {
          status: status,
        },
        {
          where: { id: req.params.libraryId },
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

exports.updateLibrary = async (req, res) => {
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

    await uploadFile(req, res);
    if (!req.body.title) {
      return res.status(400).send({
        status: false,
        message: `Please enter title!`,
      });
    } else if (!req.body.categoryId) {
      return res.status(400).send({
        status: false,
        message: `Please enter category id!`,
      });
    } else if (!req.body.bookUrl) {
      return res.status(400).send({
        status: false,
        message: `Please enter book url!`,
      });
    } else if (req.file == undefined) {
      return res.status(400).send({
        success: false,
        message: "Please Upload file",
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
    // console.log(req.file.originalname.split(".")[1], "hddgsjhcykm");
    const fileType = req.file.originalname.split(".")[1];
    if (fileType != "jpg" && fileType != "jpeg" && fileType != "png") {
      return res.status(400).send({
        success: false,
        message: "Please Upload file jpg,png,jpeg file",
      });
    }
    if (req.file.size > 1024 * 1024 * 1024 * 1024) {
      return res.status(400).send({
        success: false,
        message: "Please Upload file less 4mb",
      });
    }
    const findLastEntry = await Library.findAll({
      order: [["id", "DESC"]],
    });
    const fileName = req.file.originalname.split(".")[1];
    const newFilename = `${Date.now()}${
      findLastEntry[0]?.id ? findLastEntry[0]?.id : 0
    }.${fileName}`;

    // const filePath1 = newFilename.split("(").join("");
    // const filePath = filePath1.split(")").join("");
    // console.log(req.file, "knkdsfaskjhnk");
    await sharp(req.file.buffer)
      .resize({ width: 413, height: 269 })
      .toFile(__basedir + "/uploads/fileUpload/" + newFilename);

    // const existTitle = await Library.findOne({
    //   where: {
    //     title: req.body.title,
    //   },
    // });
    // if (existTitle) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Library already exist",
    //   });
    // }

    const existCategory = await Category.findOne({
      where: {
        id: req.body.categoryId,
      },
    });
    if (!existCategory) {
      return res.status(400).send({
        success: false,
        message: "Category id does not exist",
      });
    }

    const existLibrary = await Library.findOne({
      where: {
        id: req.params.libraryId,
      },
    });
    if (!existLibrary) {
      return res
        .status(200)
        .send({ status: false, message: "Library not found" });
    }

    const response = await Library.update(
      {
        title: req.body.title,
        categoryId: req.body.categoryId,
        bookUrl: req.body.bookUrl,
        fileUpload: newFilename,

        status: req.body.status,
      },
      {
        where: { id: req.params.libraryId },
      }
    );
    return res.status(200).send({
      status: true,
      message: "Library updated successfully",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.deleteLibrary = async (req, res) => {
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
    const existLibrary = await Library.findOne({
      where: {
        id: req.params.libraryId,
      },
    });
    if (!existLibrary) {
      return res
        .status(404)
        .send({ status: false, message: "Library not found" });
    }

    const response = await Library.destroy({
      where: {
        id: req.params.libraryId,
      },
    });
    return res.status(200).send({
      status: true,
      message: "Library deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.searchLibraryByCategoryId = async (req, res) => {
  try {
    const libraryData = [];
    const fullUrl =
      req.secure == true
        ? "https"
        : "http" + "://" + req.get("host") + "/princetonhive/img/fileUpload/";
    // console.log(req.headers.protocol, "pankaj kumar"); here req.secure gives the true or false for http protocol
    // console.log(req.headers.host, "pankaj");
    const results = await Library.findAll({
      where: {
        categoryId: req.query.categoryId,
      },
      order: [["id", "DESC"]],
    });
    for (let i = 0; i < results.length; i++) {
      libraryData.push({
        id: results[i]?.id,
        title: results[i]?.title,
        bookUrl: results[i]?.bookUrl,
        fileUpload: fullUrl + results[i]?.fileUpload,
        categoryId: results[i]?.categoryId,
        status: results[i]?.status,
        createdAt: results[i]?.createdAt,
        updatedAt: results[i]?.updatedAt,
      });
    }
    const page = parseInt(req.query.page) || 0;
    const limit = 12;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const responce = {};
    responce.dataItems = libraryData.slice(startIndex, endIndex);
    responce.totalItems = libraryData.length;
    responce.currentPage = parseInt(req.query.page) || 0;
    responce.totalPages = Math.ceil(libraryData.length / limit);
    if (responce.dataItems.length == 0) {
      return res.status(200).send({
        status: true,
        message: "Library not found",
        data: responce,
      });
    }
    return res.status(200).send({
      status: true,
      message: "Library found successfully",
      data: responce,
    });
  } catch (error) {
    return res.status(500).send({
      status: true,
      message: error.message,
    });
  }
};
