const db=require("../models")
const ContactUs=db.contactUs;
const sendMail=require("../controllers/sendmail.controller")

exports.createContact=async(req,res)=>{
await sendMail.sendMailContactUs({
        fullname:req.body.fullname,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        message:req.body.message
    })
    const result=await ContactUs.create({
        fullname:req.body.fullname,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        message:req.body.message
    })
   return res.status(200).send({status:true,message:"Create successfull contact",data:result})
}