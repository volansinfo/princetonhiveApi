const db = require("../models");
const pagination = require("../middleware/pagination");
const Op = db.Sequelize.Op;
const teacherUser = db.user;

const transformDate = (date) => {
  const dateArray = date.split("-").reverse().join("-");
  return dateArray;
};

exports.getAllTeacher = async (req, res) => {
  var fullUrl =
    req.protocol + "://" + req.get("host") + "/princetonhive/img/user/";
  try {
    const allUser = await teacherUser.findAll({
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
      order: [["id", "DESC"]],
    });
    // console.log(allUser);
    let detailsData = [];
    for (let i = 0; i < allUser.length; i++) {
      if (allUser[i].universityId) {
        let universityDetails = await teacherUser.findAll({
          where: {
            id: allUser[i].universityId,
          },
        });
        // console.log(universityDetails);
        for (let j = 0; j < universityDetails.length; j++) {
          if (allUser[i].universityId == universityDetails[j].id) {
            detailsData.push({
              id: allUser[i].id,
              fname: allUser[i].fname,
              lname: allUser[i].lname,
              profileImg: allUser[i].profileImg,
              email: allUser[i].email,
              mnumber: allUser[i].mnumber,
              address: allUser[i].address,
              city: allUser[i].city,
              state: allUser[i].state,
              pincode: allUser[i].pincode,
              gender: allUser[i].gender,
              dob: allUser[i].dob,
              country: allUser[i].country,
              status: allUser[i].status,
              uuid: allUser[i].uuid,
              aadharNo: allUser[i].aadharNo,
              panNo: allUser[i].panNo,
              department: allUser[i].department,
              roles: "teacher",
              universityName:
                universityDetails[j].fname + " " + universityDetails[j].lname,
              universityId: allUser[i].universityId,

              createdAt: allUser[i].createdAt,
              updatedAt: allUser[i].updatedAt,
            });
          }
        }
      }
    }
    let fileInfos = [];
    detailsData.forEach((file) => {
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
          dob: transformDate(file.dob),
          country: file.country,
          status: file.status,
          uuid: file.uuid,
          aadharNo: file.aadharNo,
          panNo: file.panNo,
          department: file.department,
          roles: "teacher",
          universityName: file.universityName,
          universityId: file.universityId,
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
          dob: transformDate(file.dob),
          country: file.country,
          status: file.status,
          uuid: file.uuid,
          aadharNo: file.aadharNo,
          panNo: file.panNo,
          department: file.department,
          roles: "teacher",
          universityName: file.universityName,
          universityId: file.universityId,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        });
      }
    });
    const page = parseInt(req.query.page) || 0;
    if (page < 0) {
      return res
        .status(400)
        .send({ success: false, message: "Page must not be negative!" });
    }
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = fileInfos.slice(startIndex, endIndex);
    results.totalItems = fileInfos.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(fileInfos.length / limit);

    return res.status(200).json({ success: true, data: results });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};
