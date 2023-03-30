const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const globalConfig = db.globalConfig;
const Op = db.Sequelize.Op;
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.sendotp = async (req, res) => {
  try {
  
    return res.status(200).send({ success: false, message: "OTP send" })
       
    
  } catch (e) {
 
      return res.status(500).send({ success: false, message: e.message });
    
  }
};
