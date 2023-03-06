const db = require("../models")
const teacherUser = db.user

exports.getAllTeacher = async (req, res) => {
    try {
        const allTeacherUser = []

        const allUser = await teacherUser.findAll()

        for (let i = 0; i < allUser.length; i++) {
            let userType = allUser[i].uuid.slice(0, 3)

            if (userType == "TEA") {
                allTeacherUser.push(allUser[i])
            }
        }
        res.status(200).send({ success: true, data: allTeacherUser })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }


}
