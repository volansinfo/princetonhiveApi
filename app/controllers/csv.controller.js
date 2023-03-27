const db = require("../models");
const User = db.user;
const generator = require("generate-password");
const fs = require("fs");
const csv = require("fast-csv");

const generateUUID = require("./uuid.controller");
const generateUuidStudent = require("./uuid.controller");
const { globalConfig, user } = require("../models");
const sendMail = require("./sendmail.controller");
const bcrypt = require("bcryptjs");
const { error, Console } = require("console");
let allUUID = [];
let stuMaxUUID = [];

/**
 *  generate student UUID
 */
// function getStudentUUID(reqBody) {
//   let lastUUID;
//   if (stuMaxUUID.length == 0) {
//     let alpha_series = "STU";
//     let countryCode = reqBody.country.toUpperCase();
//     let stateCode = reqBody.state.toUpperCase();
//     let cityName = reqBody.city.slice(0, 3).toUpperCase();
//     let reservNo = "4";
//     let incrementer = "000000001";

//     lastUUID =
//       alpha_series +
//       countryCode +
//       stateCode +
//       cityName +
//       reservNo +
//       incrementer;
//   } else {
//     let maxUUID = [];
//     for (let i = 0; i < stuMaxUUID.length; i++) {
//       maxUUID.push(parseInt(stuMaxUUID[i].slice(-9)));
//     }

//     console.log(reqBody, "req");
//     console.log(maxUUID, "sdasd");
//     let alpha_series = "STU";
//     let countryCode = reqBody.country.toUpperCase();
//     let stateCode = reqBody.state.toUpperCase();
//     let cityName = reqBody.city.slice(0, 3).toUpperCase();
//     let reservNo = "4";
//     let incrementer = addLeadingZeros(Math.max(...maxUUID) + 1);
//     console.log(incrementer, "incre");

//     lastUUID =
//       alpha_series +
//       countryCode +
//       stateCode +
//       cityName +
//       reservNo +
//       incrementer;
//   }

//   console.log(lastUUID, "function");
//   return lastUUID;
// }

// function addLeadingZeros(id) {
//   console.log(id, "id");
//   let noneZeroEcode = Number(id).toString();
//   console.log(noneZeroEcode);
//   let pad = "000000000";
//   let uuid =
//     pad.substring(0, pad.length - noneZeroEcode.length) + noneZeroEcode;
//   console.log(uuid);
//   return uuid;
// }

const uploadCsv = async (req, res) => {
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
        // const newUser=uuid:"STU"+row.country.toUpperCase()+row.state.toUpperCase()+(generateStudentuuid()+1)
        // console.log(row, "row");
        let lastUUID = await generateUuidStudent(row);
        console.log(lastUUID, "lastUUID");

        // let count = counter(lastUUID);
        // let counAndState = row.country + row.state;
        // const uuids = await generateUuidStudent(counAndState);
        let generatedPwd = await generator.generate({
          length: 6,
          numbers: true,
        });

        // const smtpServer = await globalConfig.findOne({});
        // if (!smtpServer) {
        //   return res.status(404).send({
        //     success: false,
        //     message: "SMTP server not configured!",
        //   });
        // }

        const username = row.fname + " " + row.lname;
        // sendMail(row.email, username, generatedPwd, smtpServer, "signup");
        // lastUUID = lastUUID++;
        let document = {
          fname: row.fname,
          lname: row.lname,
          uuid: lastUUID,
          password: bcrypt.hashSync(generatedPwd, 8),
          actualPassword: generatedPwd,
          email: row.email,
          gender: row.gender == "male" ? "1" : "2",
          dob: row.dob,
          address: row.address,
          mnumber: row.mnumber,
          city: row.city,
          state: row.state,
          pincode: row.pincode,
          country: row.country,
        };
        // console.log(document)
        await User.create(document);
      });
    res.status(200).send({
      message: "created successfully",
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
