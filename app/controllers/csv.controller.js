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
        message: "you have not permission to add bulk student",
      });
    }
    console.log(req.file.originalname, "+++++++++++++++++++++++++++++");
    if (req.file == undefined) {
      return res
        .status(400)
        .send({ status: false, message: "Please upload a CSV file!" });
    } else if (req.file.originalname.split(".")[1] != "csv") {
      return res
        .status(400)
        .send({ status: false, message: "only csv file accepted" });
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
        for (let i = 0; i < bulkData.length; i++) {
          const mnumber = await User.findOne({
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
          const email = await User.findOne({
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
            gender: (bulkData[i].gender = "male" ? "1" : "2"),
            dob: bulkData[i].dob,
            address: bulkData[i].address,
            mnumber: bulkData[i].mnumber,
            city: bulkData[i].city,
            state: bulkData[i].state,
            pincode: bulkData[i].pincode,
            country: bulkData[i].country,
            status: 1,
          };

          const user = await User.create(document);
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
            smtpServer,
            "signup"
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
