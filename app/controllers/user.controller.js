const db = require("../models");
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination")
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const uploadFile = require("../middleware/authUserImage")

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: isEmail } = require("validator/lib/isEmail");

exports.allAccess = async (req, res) => {
  try {
    const { limit, offset } = pagination.getPagination(req.query.page, 10)
    const allUser = await User.findAndCountAll({
      limit,
      offset,
      attributes: {
        exclude: ['password', 'actualPassword']
      },
      order: [
        ['id', 'DESC']
      ]
    })
    const response = pagination.getPaginationData(allUser, req.query.page, limit)
    res.status(200).json({ success: true, data: response });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message })
  }
};

exports.userBoard = async (req, res) => {

  try {
    //Get token key
    const token = req.headers["x-access-token"]
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
      userData: sorted_data
    }
    res.status(200).json(response);

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.adminBoard = async (req, res) => {

  try {
    const { limit, offset } = pagination.getPagination(req.query.page, 10)

    const allUser = await User.findAndCountAll({
      limit,
      offset,
      attributes: {
        exclude: ['password', 'actualPassword']
      },
      order: [
        ['id', 'DESC']
      ]
    })
    const response = pagination.getPaginationData(allUser, req.query.page, limit)
    res.status(200).json({ success: true, data: response });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message })
  }
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.userdelete = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!(userId)) {
      return res.status(404).send({ message: "User Not found!" })
    }

    const userdelete = await User.destroy({
      where: {
        id: userId
      }

    }).then(num => {

      if (num == 1) {

        res.status(200).send({ message: "User deleted successfully." });
      } else {
        res.status(404).send({ message: "User Not found!" });
      }

    });



  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

exports.userstatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const userStatus = req.body.status;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!(user)) {
      return res.status(404).send({ message: "User Not found!" })
    }
    else {

      if (!(req.body.status)) {
        return res.status(400).send({ message: "Please enter value for enum user_status" })
      }
      else if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res.status(400).send({ message: "Invalid input value for enum user_status" })
      }
    }
    if (userStatus == 1) {

      const result = await User.update(
        { status: userStatus },
        { where: { id: userId } }
      )

      res.status(200).send({ success: true, message: "User has been active." });
    } else {

      const result = await User.update(
        { status: userStatus },
        { where: { id: userId } }
      )
      res.status(200).send({ message: "User has been deactivate." });
    }


  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

}

exports.updateUserData = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // first name validation
    if (!(req.body.fname).trim()) {
      return res.status(400).send({ message: "Please enter first name!" })
    }

    // email validation
    if (!(req.body.email).trim()) {
      return res.status(400).send({ message: "Please enter email address!" })
    }
    else if (!isEmail(req.body.email)) {
      return res.status(400).send({ message: "Please enter valid email address!" })
    }

    // mobile number validation
    if (!(req.body.mnumber).trim()) {
      return res.status(400).send({ message: "Please enter mobile number!" })
    }
    else if ((req.body.mnumber).length != 10) {
      return res.status(400).send({ success: false, message: "Please enter valid mobile number!" })
    }
    else if (isNaN(req.body.mnumber)) {
      return res.status(400).send({ success: false, message: "please enter numeric value!" })
    }

    // pincode validation
    if (!(req.body.pincode).trim()) {
      return res.status(400).send({ message: "Please enter pincode!" })
    }
    else if ((req.body.pincode.length > 10) || (req.body.pincode.length < 5)) {
      return res.status(400).send({ message: "Please enter valid pincode!" })
    }
    else if (isNaN(req.body.pincode)) {
      return res.status(400).send({ message: "Please enter valid pincode!" })
    }

    if (!(req.body.status)) {
      return res.status(400).send({ message: "Please enter value for enum user_status" })
    }
    else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum user_status" })
    }
    const userId = req.params.id;
    const result = await User.update({
      fname: req.body.fname,
      lname: req.body.lname,
      profileImg: req.file.filename,
      path: req.file.path,
      // password: bcrypt.hashSync(req.body.password, 8),
      // actualPassword: req.body.password,
      email: req.body.email,
      mnumber: req.body.mnumber,
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
        where:
        {
          id: userId
        }
      }
    );
    res.status(200).send({ success: true, message: "User data updated successfully." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
