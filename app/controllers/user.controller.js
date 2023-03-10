const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.allAccess = async (req, res) => {
  try {
    let data = await User.findAll();
    res.status(200).json(data);

  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
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
    let response = {
      userData: data
    }
    res.status(200).json(response);

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.adminBoard = async (req, res) => {

  let data = await User.findAll({});
  let response = {
    userData: data
  }
  res.status(200).json(response);

  //res.status(200).send("Admin Content.");
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

        res.status(200).send({ message: "User was deleted successfully." });
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

      res.status(200).send({ message: "User has been active." });
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
    if (!(req.body.fname)) {
      return res.status(400).send({ message: "Please enter first name!" })
    }
    if (!(req.body.email)) {
      return res.status(400).send({ message: "Please enter email address!" })
    }
    else if (!isEmail(req.body.email)) {
      return res.status(400).send({ message: "Please enter valid email address!" })
    }
    if (!(req.body.mnumber)) {
      return res.status(400).send({ message: "Please enter mobile number!" })
    }
    if (!(req.body.pincode)) {
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
      // password: bcrypt.hashSync(req.body.password, 8),
      // actualPassword: req.body.password,
      email: req.body.email,
      mnumber: req.body.mnumber,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
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
    res.status(200).send({ message: "User data updated successfully." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
