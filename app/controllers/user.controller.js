const db = require("../models");
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const uploadFile = require("../middleware/authUserImage");
const fs = require("fs");
const sharp = require("sharp");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: isEmail } = require("validator/lib/isEmail");

exports.allAccess = async (req, res) => {
  var fullUrl =
    req.protocol + "://" + req.get("host") + "/princetonhive/img/user/";
  try {
    const allUser = await User.findAll({
      order: [["id", "DESC"]],
    });
    let fileInfos = [];
    allUser.forEach((file) => {
      if (file.profileImg !== null) {
        fileInfos.push({
          id: file.id,
          fname: file.fname,
          lname: file.lname,
          profileImg: fullUrl + file.profileImg,
          email: file.email,
          mnumber: file.mnumber,
          address: file.address,
          city: file.city,
          state: file.state,
          pincode: file.pincode,
          gender: file.gender,
          dob: file.dob,
          country: file.country,
          status: file.status,
          uuid: file.uuid,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        });
      } else {
        fileInfos.push({
          id: file.id,
          fname: file.fname,
          lname: file.lname,
          profileImg: "",
          email: file.email,
          mnumber: file.mnumber,
          address: file.address,
          city: file.city,
          state: file.state,
          pincode: file.pincode,
          gender: file.gender,
          dob: file.dob,
          country: file.country,
          status: file.status,
          uuid: file.uuid,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        });
      }
    });
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    // calculating the starting and ending index
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    // results.results = fileInfos.slice(startIndex, endIndex);
    results.dataItems = fileInfos.slice(startIndex, endIndex);
    results.totalItems = fileInfos.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(fileInfos.length / limit);

    // const response = pagination.getPaginationData(allUser, req.query.page, limit)
    res.status(200).json({ success: true, data: results });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

exports.userBoard = async (req, res) => {
  try {
    //Get token key
    const token = req.headers["x-access-token"];
    //Decode the token data
    const tokenData = jwt.decode(token);

    const userId = tokenData.id;

    let data = await User.findAll({
      where: {
        id: userId,
      },
    });
    let sorted_data = data.sort((a, b) => b.id - a.id);
    let response = {
      userData: sorted_data,
    };
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.adminBoard = async (req, res) => {
  var fullUrl =
    req.protocol + "://" + req.get("host") + "/princetonhive/img/user/";
  try {
    const allUser = await User.findAll({
      order: [["id", "DESC"]],
    });
    let fileInfos = [];
    allUser.forEach((file) => {
      if (file.profileImg !== null) {
        fileInfos.push({
          id: file.id,
          fname: file.fname,
          lname: file.lname,
          profileImg: fullUrl + file.profileImg,
          email: file.email,
          mnumber: file.mnumber,
          address: file.address,
          city: file.city,
          state: file.state,
          pincode: file.pincode,
          gender: file.gender,
          dob: file.dob,
          country: file.country,
          status: file.status,
          uuid: file.uuid,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        });
      } else {
        fileInfos.push({
          id: file.id,
          fname: file.fname,
          lname: file.lname,
          profileImg: "",
          email: file.email,
          mnumber: file.mnumber,
          address: file.address,
          city: file.city,
          state: file.state,
          pincode: file.pincode,
          gender: file.gender,
          dob: file.dob,
          country: file.country,
          status: file.status,
          uuid: file.uuid,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        });
      }
    });
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = fileInfos.slice(startIndex, endIndex);
    results.totalItems = fileInfos.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(fileInfos.length / limit);

    res.status(200).json({ success: true, data: results });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.userdelete = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).send({ message: "User Not found!" });
    }

    const userdelete = await User.destroy({
      where: {
        id: userId,
      },
    }).then((num) => {
      if (num == 1) {
        res.status(200).send({ message: "User deleted successfully." });
      } else {
        res.status(404).send({ message: "User Not found!" });
      }
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.userstatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const userStatus = req.body.status;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    } else {
      if (!req.body.status) {
        return res
          .status(400)
          .send({ message: "Please enter value for enum user_status" });
      } else if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res
          .status(400)
          .send({ message: "Invalid input value for enum user_status" });
      }
    }
    if (userStatus == 1) {
      const result = await User.update(
        { status: userStatus },
        { where: { id: userId } }
      );

      res.status(200).send({ success: true, message: "User has been active." });
    } else {
      const result = await User.update(
        { status: userStatus },
        { where: { id: userId } }
      );
      res.status(200).send({ message: "User has been deactivate." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file !== undefined) {
      if (req.file.size < 2 * 1024) {
        return res.status(400).send({
          success: false,
          message: "File too small, please select a file greater than 2kb",
        });
      }
      const newFilename = `${Date.now()}_${req.file.originalname}`;
      await sharp(req.file.buffer)
        .resize({ width: 67, height: 67 })
        .toFile(__basedir + "/uploads/user/" + newFilename);
      // first name validation
      if (!req.body.fname.trim()) {
        return res.status(400).send({ message: "Please enter first name!" });
      }
      // pincode validation
      if (!req.body.pincode.trim()) {
        return res.status(400).send({ message: "Please enter pincode!" });
      } else if (req.body.pincode.length > 10 || req.body.pincode.length < 5) {
        return res.status(400).send({ message: "Please enter valid pincode!" });
      } else if (isNaN(req.body.pincode)) {
        return res.status(400).send({ message: "Please enter valid pincode!" });
      }

      if (!req.body.status) {
        return res
          .status(400)
          .send({ message: "Please enter value for enum user_status" });
      } else if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res
          .status(400)
          .send({ message: "Invalid input value for enum user_status" });
      }
      if (req.body.aadharNo) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter aadhar number" });
      }
      if (req.body.aadharNo.length != 12) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid aadhar number" });
      }
      if (isNaN(req.body.department)) {
        return res.status(400).send({
          status: false,
          message: "Please enter numeric value in department",
        });
      }
      if (isNaN(req.body.aadharNo)) {
        return res.status(400).send({
          status: false,
          message: "Please enter numeric value in aadhar number",
        });
      }
      const aadharExist = await User.findOne({
        where: {
          aadharNo: req.body.aadharNo,
        },
      });
      if (aadharExist) {
        return res
          .status(400)
          .send({ status: 400, message: "Aadhar number already exist" });
      }
      const userId = req.params.id;
      const result = await User.update(
        {
          fname: req.body.fname,
          lname: req.body.lname,
          profileImg: newFilename,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          gender: req.body.gender,
          dob: req.body.dob,
          country: req.body.country,
          status: req.body.status,
          aadharNo: req.body.aadharNo,
          panNo: req.body.panNo,
          department: req.body.department,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      res
        .status(200)
        .send({ success: true, message: "User data updated successfully." });
    } else {
      const newFilename = null;
      if (!req.body.fname.trim()) {
        return res.status(400).send({ message: "Please enter first name!" });
      }
      // pincode validation
      if (!req.body.pincode.trim()) {
        return res.status(400).send({ message: "Please enter pincode!" });
      } else if (req.body.pincode.length > 10 || req.body.pincode.length < 5) {
        return res.status(400).send({ message: "Please enter valid pincode!" });
      } else if (isNaN(req.body.pincode)) {
        return res.status(400).send({ message: "Please enter valid pincode!" });
      }

      if (!req.body.status) {
        return res
          .status(400)
          .send({ message: "Please enter value for enum user_status" });
      } else if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res
          .status(400)
          .send({ message: "Invalid input value for enum user_status" });
      }
      const userId = req.params.id;
      const result = await User.update(
        {
          fname: req.body.fname,
          lname: req.body.lname,
          profileImg: newFilename,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          gender: req.body.gender,
          dob: req.body.dob,
          country: req.body.country,
          status: req.body.status,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      res
        .status(200)
        .send({ success: true, message: "User data updated successfully." });
    }
  } catch (e) {
    if (e.message == "File type does not allow!") {
      return res.status(400).send({ success: false, message: e.message });
    } else if (e.message == "File too large") {
      return res.status(400).send({
        success: false,
        message: "File too large, please select a file less than 3mb",
      });
    } else {
      return res.status(500).send({ success: false, message: e.message });
    }
  }
};
