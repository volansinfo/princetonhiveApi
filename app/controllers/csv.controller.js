const db = require("../models");
const User = db.user;
const generator = require("generate-password");
const fs = require("fs");
const csv = require("fast-csv");
const jwt = require("jsonwebtoken");
const Role = db.role;
const Op = db.Sequelize.Op;

const getUUID = require("./uuid.controller");
const { globalConfig, user } = require("../models");
const sendMail = require("./sendmail.controller");
const bcrypt = require("bcryptjs");
var bulkData = [];

const uploadCsv = async (req, res) => {
  bulkData = [];
  try {
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const teacherId = decodeToken.id;
    const teacherExist = await User.findOne({
      where: {
        id: teacherId,
      },
    });

    const teacherUuid = teacherExist.uuid.slice(0, 3);
    if (teacherUuid != "TEA") {
      return res.status(401).send({
        status: false,
        message: "You don't have permission to add bulk students",
      });
    }

    if (req.file == undefined) {
      return res
        .status(400)
        .send({ status: false, message: "Please upload a CSV file!" });
    }
    // console.log(req.file.originalname.slice(-3), "hgjjhgjhg");
    if (req.file.originalname.slice(-3) != "csv") {
      return res.status(400).send({
        status: false,
        message: "File type does not allow please upload csv file only",
      });
    }

    let path = __basedir + "/uploads/slider/" + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true, columns: true, relax: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", async (row) => {
        bulkData.push(row);
      })
      .on("end", async () => {
        if (bulkData.length == 0) {
          return res.status(400).send({
            status: false,
            message: "Please enter required field in the file",
          });
        }

        for (let i = 0; i < bulkData.length; i++) {
          if (!bulkData[i].fname) {
            return res.status(400).send({
              success: false,
              message: "Please enter first name in file",
            });
          } else if (!bulkData[i].email) {
            return res.status(400).send({
              success: false,
              message: "Please enter email in file",
            });
          } else if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
              bulkData[i].email.trim()
            )
          ) {
            return res.status(400).send({
              success: false,
              message: "Please enter valid email in file",
            });
          } else if (!bulkData[i].dob) {
            return res.status(400).send({
              success: false,
              message: `Please enter dob in file`,
            });
          } else if (
            !/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(
              bulkData[i].dob
            )
          ) {
            return res.status(400).send({
              success: false,
              message: `Please enter dob in this dd/mm/yyy format`,
            });
          } else if (!bulkData[i].mnumber) {
            return res.status(400).send({
              success: false,
              message: "Please enter mobile number in file",
            });
          } else if (bulkData[i].mnumber.length != 10) {
            return res.status(400).send({
              success: false,
              message: `Please enter valid mobile number: ${bulkData[i].mnumber} with 10 digit in file`,
            });
          } else if (isNaN(bulkData[i].mnumber)) {
            return res.status(400).send({
              success: false,
              message: `Mobile number should be in numeric value`,
            });
          }
        }

        for (let i = 0; i < bulkData.length; i++) {
          for (let j = i + 1; j < bulkData.length; j++) {
            if (bulkData[i].email == bulkData[j].email) {
              return res.status(400).send({
                message: `Email ${
                  (bulkData[i].email, bulkData[j].email)
                } is same in file`,
              });
            } else if (bulkData[i].mnumber == bulkData[j].mnumber) {
              return res.status(400).send({
                message: `Mobile number ${
                  (bulkData[i].mnumber, bulkData[j].mnumber)
                } is same in file`,
              });
            }
          }
        }

        for (let i = 0; i < bulkData.length; i++) {
          let mnumber = await User.findOne({
            where: {
              mnumber: bulkData[i].mnumber,
            },
          });

          if (mnumber) {
            return res.status(400).send({
              success: false,
              message: `This mobile number: ${mnumber.mnumber} is already exist!`,
            });
          }
        }

        for (let i = 0; i < bulkData.length; i++) {
          var email = await User.findOne({
            where: {
              email: bulkData[i].email,
            },
          });

          if (email) {
            return res.status(400).send({
              success: false,
              message: `This email: ${email.email} is already exists!`,
            });
          }
        }

        for (let i = 0; i < bulkData.length; i++) {
          let lastUUID = await getUUID.generateUUIDForBulkData(bulkData[i]);

          let generatedPwd = await generator.generate({
            length: 6,
            numbers: true,
          });

          let document = {
            fname: bulkData[i].fname,
            lname: bulkData[i].lname,
            uuid: lastUUID,
            password: bcrypt.hashSync(generatedPwd, 8),
            actualPassword: generatedPwd,
            email: bulkData[i].email,
            gender: bulkData[i].gender.toLowerCase() == "male" ? "1" : "2",
            dob: bulkData[i].dob.split("/").reverse().join("/"),
            address: bulkData[i].address,
            mnumber: bulkData[i].mnumber,
            city: bulkData[i].city,
            state: bulkData[i].state,
            pincode: bulkData[i].pincode,
            country: bulkData[i].country,
            status: 1,
            aadharNo: bulkData[i].aadharNo,
            panNo: bulkData[i].panNo,
            teacherId: teacherId,
          };

          let user = await User.create(document);
          let userrname = document.fname.trim() + " " + document.lname.trim();

          const roles = await Role.findAll({
            where: {
              name: {
                [Op.or]: ["student"],
              },
            },
          });

          const result = user.setRoles(roles);

          const smtpServer = await globalConfig.findOne({});
          if (!smtpServer) {
            return res
              .status(404)
              .send({ success: false, message: "SMTP server not configured!" });
          }
          sendMail(
            document.email,
            userrname,
            document.actualPassword,
            "",
            smtpServer,
            ""
          );

          if (i == bulkData.length - 1) {
            return res.status(200).send({
              success: true,
              message: "Bulk data created successfully.",
            });
          }
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + error.message,
    });
  }
};

module.exports = {
  uploadCsv,
};
