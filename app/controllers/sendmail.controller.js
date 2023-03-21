const nodemailer = require("nodemailer")

const sendMail = async (userEmail, username, generatedPwd, smtpServer, type) => {




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
    // let info
    if (type == 'forgotPassword') {
        info = await transporter.sendMail({
            from: `"Hive Step  "<${smtpServer.authUser}>`,
            to: userEmail,
            subject: "Hive Step new password",
            text: "Hello from the Hive Step side.",
            html: `Your password has been changed and your new password is:<b><h1> ${generatedPwd}</h1></b>`
        })
    }
    else {
        info = await transporter.sendMail({
            from: `"Hive Step  "<${smtpServer.authUser}>`,
            to: userEmail,
            subject: "Welcome to Hive Step",
            text: "Hello from the Hive Step side.",
            html: `Welcome to hive steps<br><br><br>
            Dear  (${username})<br><br>
            Thanks for Sign-Up.We are delighted to welcome you to the company's internship program. We are delighted to have you join our team! We were happy to read about your interests and endeavours in the areas of (internship tasks) as well as your personal, academic, and professional objectives.<br><br>
            We look forward to welcoming you soon!<br>
            Hive Steps Team<br>
            <br>
            Email : <b>${userEmail}</b><br>Password : <b> ${generatedPwd}</b>`
        })

    }


    // console.log("Message sent: %s", info.messageId)

    // console.log(info)

}


module.exports = sendMail