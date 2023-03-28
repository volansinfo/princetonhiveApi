const db = require("../models");
const User = db.user;
const generator = require("generate-password");
const fs = require("fs");
const csv = require("fast-csv");

const generateUUIDForBulkData = require("./uuid.controller");
const { globalConfig, user } = require("../models");
const sendMail = require("./sendmail.controller");
const bcrypt = require("bcryptjs");
var bulkData = []


const uploadCsv = async (req, res) => {
  bulkData=[]
  try {
    if (req.file == undefined) {
      return res
        .status(400)
        .send({ status: false, message: "Please upload a CSV file!" });
    }


    let path = __basedir + "/uploads/slider/" + req.file.filename;


    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true, columns: true, relax: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", async (row) => {
        bulkData.push(row)
      })
      .on("end", async () => {

        for (let i = 0; i < bulkData.length; i++) {
          const email = await User.findOne({
            where: {
              email: bulkData[i].email
            }
          })

          if (email) {
            return res.status(400).send({ success: false, message: `This email: ${email.email} is already exists!` })
          }
        }

        for (let i = 0; i < bulkData.length; i++) {
          let lastUUID = await generateUUIDForBulkData(bulkData[i]);

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
          }

          await User.create(document);

          if (i == bulkData.length - 1) {
            return res.status(200).send({ success: true, message: "Bulk data created successfully." })
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
  uploadCsv
};
