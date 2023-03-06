const db = require("../models")
const studentUser = db.user

exports.getAllStudent = async (req, res) => {
    try {
        const allStudentUser = []

        const allUser = await studentUser.findAll()

        for (let i = 0; i < allUser.length; i++) {
            let userType = allUser[i].uuid.slice(0, 3)

            if (userType == "STU") {
                allStudentUser.push(allUser[i])
            }
        }
        res.status(200).send({ success: true, data: allStudentUser })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }


}
