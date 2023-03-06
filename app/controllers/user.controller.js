const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = async (req, res) => {

    try{
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
          userData:data
      }
      res.status(200).json(response); 

    } catch (error){
      return res.status(500).send({ message: error.message });
    }
  };
  
  exports.adminBoard = async (req, res) => {

    let data = await User.findAll({});
    let response = {
        userData:data
    }
    res.status(200).json(response); 

    //res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  exports.userdelete = async(req,res)=>{
    try{
      const userId = req.params.id;
      
       const userdelete = await User.destroy({
        where: {
          id: userId
        }
      
       }).then(num=>{

        if(num == 1){

          const userRole = Role.destroy({
            where: {
              userId: userId
            }
          
           });
           
          res.status(200).send({message:"User was deleted successfully!"});
        }else{
          res.status(500).send({message:"Cannot delete User. Maybe User was not found!!"});
        }

       });
      

       
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  exports.userstatus = async(req, res)=>{
    try{
      const userId = req.params.id;
      const userStatus = req.body.status;
      if(userStatus==1){

        const result = await User.update(
          { status:userStatus},
          { where: {id: userId } }
        )

        res.status(200).send({message:"User has bee active!"});
      }else{

        const result = await User.update(
          { status:userStatus},
          { where: {id: userId } }
        )
        res.status(200).send({message:"User has bee deactivate!"});
      }
     
      
    } catch (error){
      return res.status(500).send({ message: error.message });
    }

  }

  exports.updateUserData = async(req,res)=>{
    try{
      const userId = req.params.id;
      console.log(req.body);
      const result = await User.update({ 
        fname:req.body.fname,
        lname:req.body.lname,
        password: bcrypt.hashSync(req.body.password, 8),
        actualPassword:req.body.password,
        email:req.body.email,
        mnumber:req.body.mnumber,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
        country:req.body.country,
        status:req.body.state,
      },
        { where: {id: userId } }
      );
      res.status(200).send({message:"User data updated successfully!"});
    } catch (error){
      return res.status(500).send({ message: error.message });
    }
  }
  