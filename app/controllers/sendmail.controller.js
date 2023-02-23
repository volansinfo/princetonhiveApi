const nodemailer = require("nodemailer")

const sendMail = async (userEmail, generatedPwd,smtpServer) => {

    


//     host: "smtp.office365.com",
//     port: 587,
//     auth: {
//         user: "support@princetonhive.com",
//         pass: "Qaj30675"
//     }
// })

// let info = await transporter.sendMail({
//     from: '"Hive Step  "<support@princetonhive.com>',
//     to: userEmail,
//     subject: "Hive Step new password",
//     text: "Hello from the Hive Step side.",
//     html: `Your password has been changed and your new password is:<b><h1> ${generatedPwd}</h1></b>`


    /**
     * connect with the smpt
     */
    let transporter = await nodemailer.createTransport({
        host: smtpServer.hostName,
        port: smtpServer.portNumber,
        auth: {
            user: smtpServer.authUser,
            pass: smtpServer.authPassword
        }
    })

    let info = await transporter.sendMail({
        from: `"Hive Step  "<${smtpServer.authUser}>`,
        to: userEmail,
        subject: "Hive Step new password",
        text: "Hello from the Hive Step side.",
        html: `Your password has been changed and your new password is:<b><h1> ${generatedPwd}</h1></b>`
    })

    // console.log("Message sent: %s", info.messageId)

    // console.log(info)

}


module.exports = sendMail