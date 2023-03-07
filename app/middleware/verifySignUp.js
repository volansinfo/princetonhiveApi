const { check, validationResult } = require("express-validator");
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // // Username
    // let user = await User.findOne({
    //   where: {
    //     username: req.body.username
    //   }
    // });

    // if (user) {
    //   return res.status(400).send({
    //     message: "Failed! Username is already in use!"
    //   });
    // }

    // Email
    user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }

  next();
};

validatePwdAndConfirmPwd = [
  check('oldPassword').trim().not().isEmpty().withMessage('old password is required.'),

  check('newPassword').trim().not().isEmpty().withMessage('new password is required.')
    .isLength({ min: 6, max: 20 }).withMessage('new password must be 6 to 20 characters long!'),

  check('confirmPassword').trim().not().isEmpty().withMessage('confirm password is required.')
    .custom((value, { req }) => {
      if (value != req.body.newPassword) {
        throw new Error('Password and Confirm passwprd must be same!')
      }
      return true;
    })
]

passwordValidation = async (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error })


}

validatefname = [
  check('fname').trim().not().isEmpty().withMessage('first name is required.')
    .isLength({ min: 3, max: 50 }).withMessage('first name must be 3 to 50 characters long!')
]

fnameValidation = async (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error })

}

validateEmail = [
  check('email').trim().not().isEmpty().withMessage('email is required!')
    .isEmail().withMessage('Please enter valid email!')
]

emailValidation = async (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error })
}

validateMnumber = [
  check('mnumber').trim().not().isEmpty().withMessage('Please enter mobile number !')
]

mnumberValidation = async (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error })
}

validatePincode = [
  check('pincode').trim().not().isEmpty().withMessage('Please enter pincode!')
    .isLength({ min: 5, max: 10 }).withMessage('pincode must be 5 to 10 characters long!')
]

pincodeValidation = async (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  res.json({ success: false, message: error })
}


const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  validatePwdAndConfirmPwd,
  passwordValidation,
  validatefname,
  fnameValidation,
  validateEmail,
  emailValidation,
  validateMnumber,
  mnumberValidation,
  validatePincode,
  pincodeValidation
};

module.exports = verifySignUp;
