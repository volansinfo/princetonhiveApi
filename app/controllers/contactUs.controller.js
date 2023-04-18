const db=require("../models")
const ContactUs=db.contactUs;
const globalConfig = db.globalConfig;

const sendMail = require("./sendmail.controller");
exports.createContact=async(req,res)=>{

    const smtpServer = await globalConfig.findOne({});

      if (!smtpServer) {
        return res
          .status(404)
          .send({ success: false, message: "SMTP server not configured!" });
      }

    const result=await ContactUs.create({
        fullname:req.body.fullname,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        message:req.body.message
    })

    sendMail(req.body.email,req.body.fullname,"",req.body.phoneNumber,smtpServer,req.body.message,"contactUs")

   return res.status(200).send({status:true,message:"Message sent successfully!"})
}