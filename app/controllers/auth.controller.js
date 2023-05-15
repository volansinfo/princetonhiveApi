const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const globalConfig = db.globalConfig;
const generator = require("generate-password");
const Op = db.Sequelize.Op;
const verifySignUp = require("../middleware/verifySignUp");
const uploadFile = require("../middleware/authUserImage");
const fs = require("fs");
const sharp = require("sharp");

const sendMail = require("./sendmail.controller");
const getUUID = require("./uuid.controller");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { where } = require("sequelize");
const { check } = require("express-validator");
const { validateEmail } = require("../middleware/verifySignUp");
const { default: isEmail } = require("validator/lib/isEmail");

exports.signup = async (req, res) => {
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
      const uuid = await getUUID.generateUUID(req);

      if (req.body.roles[0] == "admin" && req.body.teacherId) {
        return res.status(400).send({
          success: false,
          message:
            "You can not create admin because you have entered teacher id!",
        });
      }
      if (req.body.roles[0] == "teacher" && req.body.teacherId) {
        return res.status(400).send({
          success: false,
          message:
            "You can not create teacher because you have entered teacher id!",
        });
      }
      if (req.body.roles[0] == "university" && req.body.teacherId) {
        return res.status(400).send({
          success: false,
          message:
            "You can not create university because you have entered teacher id!",
        });
      }
      if (req.body.roles[0] == "support" && req.body.teacherId) {
        return res.status(400).send({
          success: false,
          message:
            "You can not create support because you have entered teacher id!",
        });
      }

      if (req.body.roles[0] == "student") {
        const userId = req.body.teacherId;
        if (!userId) {
          return res
            .status(400)
            .send({ success: false, message: "Please enter teacher id!" });
        } else if (isNaN(userId)) {
          return res.status(400).send({
            success: false,
            message: "Please enter numeric value for teacher id!",
          });
        }
        const existTeacher = await User.findOne({
          where: {
            id: userId,
          },
          attributes: {
            exclude: ["password", "actualPassword"],
          },
          include: [
            {
              model: db.role,
              as: "roles",
              where: { id: "3" },
              required: true,
              attributes: [],
            },
          ],
        });
        if (existTeacher == null) {
          return res
            .status(400)
            .send({ success: false, message: "Teacher does not exist!" });
        }
        if (!req.body.universityId) {
          return res
            .status(400)
            .send({ success: false, message: "Please enter universityId" });
        }
        const existUniversity = await User.findOne({
          where: {
            id: parseInt(req.body.universityId),
          },
          attributes: {
            exclude: ["password", "actualPassword"],
          },
          include: [
            {
              model: db.role,
              as: "roles",
              where: { id: "2" },
              required: true,
              attributes: [],
            },
          ],
        });
        if (existUniversity == null) {
          return res
            .status(400)
            .send({ success: false, message: "UniversityId does not exist" });
        }
      }

      let generatedPwd = await generator.generate({
        length: 6,
        numbers: true,
      });
      if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res
          .status(400)
          .send({ message: "Invalid input value for enum user_status" });
      }

      // first name validation

      if (!req.body.fname.trim()) {
        return res
          .status(400)
          .send({ success: false, message: "Please enter first name!" });
      } else if (req.body.fname.length < 3 || req.body.fname.length > 50) {
        return res.status(400).send({
          success: false,
          message: "first name must be 3 to 50 characters long!",
        });
      }

      // checking duplicate email

      checkUser = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (checkUser) {
        return res.status(400).send({
          success: false,
          message: "Failed! Email is already in use!",
        });
      }
      // email validation
      if (!req.body.email.trim()) {
        return res
          .status(400)
          .send({ success: false, message: "Please enter email address!" });
      } else if (!isEmail(req.body.email)) {
        return res
          .status(400)
          .send({ success: false, message: "please enter valid email!" });
      }

      // mobile number validation
      checkUser = await User.findOne({
        where: {
          mnumber: req.body.mnumber,
        },
      });

      if (checkUser) {
        return res.status(400).send({
          success: false,
          message: "Failed! Mobile number is already in use!",
        });
      }
      if (!req.body.mnumber.trim()) {
        return res
          .status(400)
          .send({ success: false, message: "Please enter mobile number!" });
      } else if (req.body.mnumber.length != 10) {
        return res.status(400).send({
          success: false,
          message: "Please enter valid mobile number!",
        });
      } else if (isNaN(req.body.mnumber)) {
        return res
          .status(400)
          .send({ success: false, message: "please enter numeric value!" });
      }

      // pincode validation
      if (!req.body.pincode.trim()) {
        return res
          .status(400)
          .send({ success: false, message: "Please enter pincode!" });
      } else if (req.body.pincode.length < 5 || req.body.pincode.length > 10) {
        return res.status(400).send({
          success: false,
          message: "pincode must be 5 to 10 characters long!",
        });
      } else if (isNaN(req.body.pincode)) {
        return res
          .status(400)
          .send({ success: false, message: "please enter numeric value!" });
      }
      if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res
          .status(400)
          .send({ message: "Invalid input value for enum user_status" });
      }
      const roleExist = await Role.findOne({
        where: {
          name: req.body.roles[0],
        },
      });

      if (!req.body.roles[0]) {
        return res
          .status(400)
          .send({ success: false, message: "Please enter role!" });
      } else if (roleExist == null) {
        return res
          .status(400)
          .send({ success: false, message: "Role does not exist!" });
      }
      const adharNUM = req.body?.aadharNo;
      if (adharNUM.length != 0 && adharNUM.length != 12 && adharNUM != null) {
        return res.status(400).send({
          status: false,
          message: "Plaese enter valid aadhaar number",
        });
      }
      if (isNaN(req.body.aadharNo)) {
        return res.status(400).send({
          status: false,
          message: "Please enter numeric value in aadhaar number",
        });
      }
      if (!req.body.department) {
        return res.status(400).send({
          status: false,
          message: "Please select department",
        });
      }
      if (isNaN(req.body.department)) {
        return res.status(400).send({
          status: false,
          message: "Please enter numeric value in department",
        });
      }
      const aadharExist = await User.findOne({
        where: {
          aadharNo: req.body.aadharNo,
        },
      });
      if (
        aadharExist?.aadharNo == req.body.aadharNo &&
        aadharExist?.aadharNo.length > 0
      ) {
        return res
          .status(400)
          .send({ status: 400, message: "Aadhaar number already exist" });
      }
      if (!req.body.dob) {
        return res
          .status(400)
          .send({ success: false, message: "Please select date of birth!" });
      }
      const dt = Date().split(" ")[3];
      if (
        req.body.dob.split("-").length != 3 ||
        req.body.dob.split("-")[2] == "" ||
        req.body.dob.split("-")[2] > dt ||
        req.body.dob.split("-")[2].length != 4
      ) {
        return res
          .status(400)
          .send({ success: false, message: "Please select valid date!" });
      }

      if (req.body.roles[0] == "teacher") {
        const universityId = req.body.universityId;
        if (!universityId) {
          return res
            .status(400)
            .send({ status: false, message: "Please enter universityId" });
        }
        const ExistUniversity = await User.findOne({
          where: {
            id: parseInt(universityId),
          },
          include: [
            {
              model: db.role,
              as: "roles",
              where: { id: "2" },
              required: true,
              attributes: [],
            },
          ],
        });
        if (!ExistUniversity) {
          return res
            .status(404)
            .send({ status: false, message: "UniversityId does not exist" });
        }
      }
      const user = await User.create({
        fname: req.body.fname,
        lname: req.body.lname,
        profileImg: newFilename || null,
        password: bcrypt.hashSync(generatedPwd, 8),
        actualPassword: generatedPwd,
        email: req.body.email,
        mnumber: req.body.mnumber,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        gender: req.body.gender,
        dob: req.body.dob.split("-").reverse().join("-"),
        country: req.body.country,
        status: req.body.status ? req.body.status : 1,
        uuid: uuid,
        universityId: req.body.universityId,
        teacherId: req.body.teacherId ? req.body.teacherId : null,
        aadharNo: req.body.aadharNo ? req.body.aadharNo : null,
        panNo: req.body.panNo ? req.body.panNo : null,
        department: req.body.department,
      });
      const userEmail = req.body.email;
      const username = req.body.fname.trim() + " " + req.body.lname.trim();

      const smtpServer = await globalConfig.findOne({});

      if (!smtpServer) {
        return res
          .status(404)
          .send({ success: false, message: "SMTP server not configured!" });
      }

      sendMail(userEmail, username, generatedPwd, "", smtpServer, "", "signup");

      if (req.body.roles[0]) {
        console.log(req.body.roles[0]);
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        });
        const result = user.setRoles(roles);
        if (result)
          res.status(200).send({
            success: true,
            message: `User registered successfully & Your password has been sent to mail : ${userEmail}`,
          });
      } else {
        // user has role = 1
        const result = user.setRoles([1]);
        if (result)
          res.status(200).send({
            success: true,
            message: `User registered successfully & Your password has been sent to mail : ${userEmail}`,
          });
        // res.status(200).send({ message: "User registered successfully!" });
      }
    } else {
      {
        const newFilename = null;
        const uuid = await getUUID.generateUUID(req);
        if (req.body.roles[0] == "admin" && req.body.teacherId) {
          return res.status(400).send({
            success: false,
            message:
              "You can not create admin because you have entered teacher id!",
          });
        }
        if (req.body.roles[0] == "teacher" && req.body.teacherId) {
          return res.status(400).send({
            success: false,
            message:
              "You can not create teacher because you have entered teacher id!",
          });
        }
        if (req.body.roles[0] == "university" && req.body.teacherId) {
          return res.status(400).send({
            success: false,
            message:
              "You can not create university because you have entered teacher id!",
          });
        }
        if (req.body.roles[0] == "support" && req.body.teacherId) {
          return res.status(400).send({
            success: false,
            message:
              "You can not create support because you have entered teacher id!",
          });
        }

        if (req.body.roles[0] == "student") {
          const userId = req.body.teacherId;
          if (!userId) {
            return res
              .status(400)
              .send({ success: false, message: "Please enter teacher id!" });
          } else if (isNaN(userId)) {
            return res.status(400).send({
              success: false,
              message: "Please enter numeric value for teacher id!",
            });
          }
          const existTeacher = await User.findOne({
            where: {
              id: userId,
            },
            attributes: {
              exclude: ["password", "actualPassword"],
            },
            include: [
              {
                model: db.role,
                as: "roles",
                where: { id: "3" },
                required: true,
                attributes: [],
              },
            ],
          });
          if (existTeacher == null) {
            return res
              .status(400)
              .send({ success: false, message: "Teacher does not exist!" });
          }
          if (!req.body.universityId) {
            return res
              .status(400)
              .send({ status: false, message: "Please enter universityId" });
          }
          const existUniversity = await User.findOne({
            where: {
              id: parseInt(req.body.universityId),
            },
            attributes: {
              exclude: ["password", "actualPassword"],
            },
            include: [
              {
                model: db.role,
                as: "roles",
                where: { id: "2" },
                required: true,
                attributes: [],
              },
            ],
          });
          if (existUniversity == null) {
            return res
              .status(400)
              .send({
                success: false,
                message: "UniversityId does not exist!",
              });
          }
        }

        let generatedPwd = await generator.generate({
          length: 6,
          numbers: true,
        });
        if (!(req.body.status == 0) && !(req.body.status == 1)) {
          return res
            .status(400)
            .send({ message: "Invalid input value for enum user_status" });
        }

        // first name validation

        if (!req.body.fname.trim()) {
          return res
            .status(400)
            .send({ success: false, message: "Please enter first name!" });
        } else if (req.body.fname.length < 3 || req.body.fname.length > 50) {
          return res.status(400).send({
            success: false,
            message: "first name must be 3 to 50 characters long!",
          });
        }

        // checking duplicate email

        checkUser = await User.findOne({
          where: {
            email: req.body.email,
          },
        });

        if (checkUser) {
          return res.status(400).send({
            success: false,
            message: "Failed! Email is already in use!",
          });
        }
        // email validation
        if (!req.body.email.trim()) {
          return res
            .status(400)
            .send({ success: false, message: "Please enter email address!" });
        } else if (!isEmail(req.body.email)) {
          return res
            .status(400)
            .send({ success: false, message: "please enter valid email!" });
        }

        // mobile number validation
        checkUser = await User.findOne({
          where: {
            mnumber: req.body.mnumber,
          },
        });

        if (checkUser) {
          return res.status(400).send({
            success: false,
            message: "Failed! Mobile number is already in use!",
          });
        }
        if (!req.body.mnumber.trim()) {
          return res
            .status(400)
            .send({ success: false, message: "Please enter mobile number!" });
        } else if (req.body.mnumber.length != 10) {
          return res.status(400).send({
            success: false,
            message: "Please enter valid mobile number!",
          });
        } else if (isNaN(req.body.mnumber)) {
          return res
            .status(400)
            .send({ success: false, message: "please enter numeric value!" });
        }

        // pincode validation
        if (!req.body.pincode.trim()) {
          return res
            .status(400)
            .send({ success: false, message: "Please enter pincode!" });
        } else if (
          req.body.pincode.length < 5 ||
          req.body.pincode.length > 10
        ) {
          return res.status(400).send({
            success: false,
            message: "pincode must be 5 to 10 characters long!",
          });
        } else if (isNaN(req.body.pincode)) {
          return res
            .status(400)
            .send({ success: false, message: "please enter numeric value!" });
        }
        if (!(req.body.status == 0) && !(req.body.status == 1)) {
          return res
            .status(400)
            .send({ message: "Invalid input value for enum user_status" });
        }
        const roleExist = await Role.findOne({
          where: {
            name: req.body.roles[0],
          },
        });

        if (!req.body.roles[0]) {
          return res
            .status(400)
            .send({ success: false, message: "Please enter role!" });
        } else if (roleExist == null) {
          return res
            .status(400)
            .send({ success: false, message: "Role does not exist!" });
        }

        const adharNUM = req.body.aadharNo;
        if (adharNUM.length != 0 && adharNUM.length != 12 && adharNUM != null) {
          return res.status(400).send({
            status: false,
            message: "Plaese enter valid aadhaar number",
          });
        }
        if (isNaN(req.body.aadharNo)) {
          return res.status(400).send({
            status: false,
            message: "Please enter numeric value in aadhaar number",
          });
        }
        if (!req.body.department) {
          return res.status(400).send({
            status: false,
            message: "Please select department",
          });
        }
        if (isNaN(req.body.department)) {
          return res.status(400).send({
            status: false,
            message: "Please enter numeric value in department",
          });
        }
        const aadharExist = await User.findOne({
          where: {
            aadharNo: req.body.aadharNo,
          },
        });
        if (
          aadharExist?.aadharNo == req.body?.aadharNo &&
          aadharExist?.aadharNo.length > 0
        ) {
          return res
            .status(400)
            .send({ status: 400, message: "Aadhaar number already exist" });
        }
        if (!req.body.dob) {
          return res
            .status(400)
            .send({ success: false, message: "Please select date of birth!" });
        }
        const dt = Date().split(" ")[3];
        if (
          req.body.dob.split("-").length != 3 ||
          req.body.dob.split("-")[2] == "" ||
          req.body.dob.split("-")[2] > dt ||
          req.body.dob.split("-")[2].length != 4
        ) {
          return res
            .status(400)
            .send({ success: false, message: "Please select valid date!" });
        }
        if (req.body.roles[0] == "teacher") {
          const universityId = req.body.universityId;
          if (!universityId) {
            return res
              .status(400)
              .send({ status: false, message: "Please enter universityId" });
          }
          const ExistUniversity = await User.findOne({
            where: {
              id: parseInt(universityId),
            },
            include: [
              {
                model: db.role,
                as: "roles",
                where: { id: "2" },
                required: true,
                attributes: [],
              },
            ],
          });
          if (!ExistUniversity) {
            return res
              .status(404)
              .send({ status: false, message: "UniversityId does not exist" });
          }
        }

        const user = await User.create({
          fname: req.body.fname,
          lname: req.body.lname,
          profileImg: newFilename,
          password: bcrypt.hashSync(generatedPwd, 8),
          actualPassword: generatedPwd,
          email: req.body.email,
          mnumber: req.body.mnumber,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          gender: req.body.gender,
          dob: req.body.dob.split("-").reverse().join("-"),
          country: req.body.country,
          status: req.body.status ? req.body.status : 1,
          uuid: uuid,
          universityId: req.body.universityId ? req.body.universityId : null,
          teacherId: req.body.teacherId ? req.body.teacherId : null,
          aadharNo: req.body.aadharNo ? req.body.aadharNo : null,
          panNo: req.body.panNo ? req.body.panNo : null,
          department: req.body.department,
        });
        const userEmail = req.body.email;
        const username = req.body.fname.trim() + " " + req.body.lname.trim();

        const smtpServer = await globalConfig.findOne({});

        if (!smtpServer) {
          return res
            .status(404)
            .send({ success: false, message: "SMTP server not configured!" });
        }

        sendMail(
          userEmail,
          username,
          generatedPwd,
          "",
          smtpServer,
          "",
          "signup"
        );

        if (req.body.roles[0]) {
          console.log(req.body.roles[0], "line639");
          const roles = await Role.findAll({
            where: {
              name: {
                [Op.or]: req.body.roles,
              },
            },
          });
          const result = user.setRoles(roles);
          if (result)
            res.status(200).send({
              success: true,
              message: `User registered successfully & Your password has been sent to mail : ${userEmail}`,
            });
        } else {
          // user has role = 1
          const result = user.setRoles([1]);
          if (result)
            res.status(200).send({
              success: true,
              message: `User registered successfully & Your password has been sent to mail : ${userEmail}`,
            });
          // res.status(200).send({ message: "User registered successfully!" });
        }
      }
    }
  } catch (e) {
    console.log(e);
    if (e.message == "File type does not allow!") {
      return res.status(400).send({ success: false, message: e.message });
    }
    if (e.message == 'invalid input syntax for type date: "Invalid date"') {
      return res
        .status(400)
        .send({ success: false, message: "Please enter valid date!" });
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

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (req.body.email == "") {
      return res.status(400).send({ message: "Please enter email address!" });
    } else if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }

    const userStatus = await User.findOne({
      where: {
        status: "1",
      },
    });
    if (!userStatus) {
      return res.status(400).send({ message: "User status has been pending!" });
    }
    if (user.status == 0) {
      return res.status(400).send({
        message: "User inactive please contact to the support or admin!",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (req.body.password == "") {
      return res.status(400).send({
        message: "Please enter password!",
      });
    } else if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    // if (user.tokenKey) {
    //   return res.status(401).send({
    //     success: false,
    //     message: "User already logged on another device",
    //   });
    // }

    const token = jwt.sign({ id: user.id }, config.secret, {
      // expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    if (authorities == "ROLE_STUDENT" || authorities == "ROLE_TEACHER") {
      return res.status(401).send({
        success: false,
        message: `You are trying to login as ${authorities} and you can not login here!`,
      });
    }

    //let tokenKey =  req.session.token = token;
    let tokenKey = token;

    await User.update(
      {
        tokenKey: token,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    return res.status(200).send({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      roles: authorities,
      accessToken: tokenKey,
      message: "Login successfully",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.studentOrTeacherSignin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (req.body.email == "") {
      return res.status(400).send({ message: "Please enter email address!" });
    } else if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }

    const userStatus = await User.findOne({
      where: {
        status: "1",
      },
    });
    if (!userStatus) {
      return res.status(400).send({ message: "User status has been pending!" });
    }
    if (user.status == 0) {
      return res.status(400).send({
        message: "User inactive please contact to the support or admin!",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (req.body.password == "") {
      return res.status(400).send({
        message: "Please enter password!",
      });
    } else if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    // if (user.tokenKey) {
    //   return res.status(401).send({
    //     success: false,
    //     message: "User already logged on another device",
    //   });
    // }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    if (authorities == "ROLE_STUDENT" || authorities == "ROLE_TEACHER") {
      let tokenKey = token;

      await User.update(
        {
          tokenKey: token,
        },
        {
          where: {
            id: user.id,
          },
        }
      );

      return res.status(200).send({
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roles: authorities,
        accessToken: tokenKey,
        message: "Login successfully",
      });
    } else {
      return res.status(401).send({
        success: false,
        message: `You are trying to login as ${authorities} and you can not login here!`,
      });
    }
    //let tokenKey =  req.session.token = token;
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    let token = req.headers["x-access-token"];

    let newToken = null;

    const tokenData = jwt.decode(token);

    const user = await User.findOne({
      where: {
        id: tokenData.id,
      },
    });

    if (user.tokenKey != token) {
      return res
        .status(401)
        .send({ success: false, message: "token not matched!" });
    }
    if (user.tokenKey == null) {
      return res
        .status(200)
        .send({ success: true, message: "User already signout!" });
    }

    await User.update(
      {
        tokenKey: newToken,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    return res.status(200).send({
      message: "Sign out successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Not found!" });
    }

    const isValidPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .send({ success: false, message: "Old password is not valid" });
    }

    await User.update(
      {
        password: bcrypt.hashSync(req.body.newPassword, 8),
        actualPassword: req.body.newPassword,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    res
      .status(200)
      .send({ success: true, message: "Password change successfully." });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const hostType = req.body.hostType;
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User does not exist!" });
    }
    if (!req.body.email) {
      return res
        .status(400)
        .send({ success: false, message: "Please enter email address!" });
    }

    let generatedPwd = await generator.generate({
      length: 6,
      numbers: true,
    });

    const smtpServer = await globalConfig.findOne({
      where: {
        hostType: hostType,
      },
    });

    if (!smtpServer) {
      return res
        .status(404)
        .send({ success: false, message: "SMTP server not configured!" });
    }

    await User.update(
      {
        password: bcrypt.hashSync(generatedPwd, 8),
        actualPassword: generatedPwd,
      },
      {
        where: {
          email: userEmail,
        },
      }
    );

    sendMail(userEmail, "", generatedPwd, "", smtpServer, "", "forgotPassword");

    res.status(200).send({
      success: true,
      message: `Your new password has been sent to mail : ${userEmail}`,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
