const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const globalConfig = db.globalConfig
const generator = require('generate-password')
const Op = db.Sequelize.Op;
const { verifySignUp } = require("../middleware");

const sendMail = require("./sendmail.controller")
const generateUUID = require("./uuid.controller")



const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { where } = require("sequelize");

exports.signup = async (req, res) => {
  // Save User to Database
  try {

    const uuid = await generateUUID(req)

    // res.status(200).send({ message: "User registered successfully!" });
    let generatedPwd = await generator.generate({
      length: 6,
      numbers: true,
    })
    const user = await User.create({
      fname: req.body.fname,
      lname: req.body.lname,
      password: bcrypt.hashSync(generatedPwd, 8),
      actualPassword: generatedPwd,
      email: req.body.email,
      mnumber: req.body.mnumber,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country,
      status: req.body.status,
      uuid: uuid
      // username: req.body.username,
      // email: req.body.email,
      // password: bcrypt.hashSync(req.body.password, 8),
    });
    const userEmail = req.body.email
    // const hostType = req.body.hostType


    const smtpServer = await globalConfig.findOne({
    })

    if (!smtpServer) {
      return res.status(404).send({ success: false, message: "SMTP server not configured!" })
    }


    sendMail(userEmail, generatedPwd, smtpServer, 'signup')

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      const result = user.setRoles(roles);
      if (result)
        res.status(200).send({ message: `User registered successfully & Your password has been sent to mail : ${userEmail}` });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result)
        res.status(200).send({ success: true, message: `User registered successfully & Your password has been sent to mail : ${userEmail}` })
      // res.status(200).send({ message: "User registered successfully!" });
    }




  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user == null) {
      return res.status(404).send({ message: "Please enter email address!" });
    }
    else if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }

    const userStatus = await User.findOne({
      where: {
        status: '1',
      },
    });
    if (!userStatus) {
      return res.status(404).send({ message: "User status has been pending!" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (passwordIsValid == "") {
      return res.status(401).send({
        message: "Please enter valid password!",
      });
    }
    else if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    //let tokenKey =  req.session.token = token;
    let tokenKey = token;

    await User.update({
      tokenKey: token,
    }, {
      where: {
        id: user.id
      }
    })

    return res.status(200).send({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      roles: authorities,
      accessToken: tokenKey,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    let token = req.headers["x-access-token"];
    let newToken = "Sign out"

    const tokenData = jwt.decode(token);

    const user = await User.findOne({
      where: {
        id: tokenData.id,
      },
    });

    await User.update({
      tokenKey: newToken,
    }, {
      where: {
        id: user.id
      }
    })
    return res.status(200).send({
      message: "Sign out successfully."
    });
  } catch (err) {
    return res.status(500).send({ message: error.message });
  }
}


exports.changePassword = async (req, res) => {
  try {

    const userId = req.params.userId;

    const user = await User.findOne({
      where: {
        id: userId
      }
    })

    if (!user) {
      return res.status(404).send({ success: false, message: "User Not found!" });
    }


    const isValidPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    )

    if (!isValidPassword) {
      return res.status(401).send({ success: false, message: "Old password is not valid" });
    }

    await User.update({
      password: bcrypt.hashSync(req.body.newPassword, 8),
      actualPassword: req.body.newPassword
    }, {
      where: {
        id: userId
      }
    })


    res.status(200).send({ success: true, message: "Password change successfully." })

  } catch (error) {
    res.status(500).send({ success: false, message: error.message })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const userEmail = req.body.email
    const hostType = req.body.hostType
    const user = await User.findOne({
      where: {
        email: userEmail
      }
    })

    if (!user) {
      return res.status(404).send({ success: false, message: "User does not exist!" });
    }

    let generatedPwd = await generator.generate({
      length: 6,
      numbers: true,
    })

    const smtpServer = await globalConfig.findOne({
      where: {
        hostType: hostType
      }
    })

    if (!smtpServer) {
      return res.status(404).send({ success: false, message: "SMTP server not configured!" })
    }

    await User.update({
      password: bcrypt.hashSync(generatedPwd, 8),
      actualPassword: generatedPwd
    }, {
      where: {
        email: userEmail
      }
    })

    sendMail(userEmail, generatedPwd, smtpServer, 'forgotPassword')

    res.status(200).send({ success: true, message: `Your new password has been sent to mail : ${userEmail}` })

  } catch (e) {
    res.status(500).send({ success: false, message: error.message })
  }
}