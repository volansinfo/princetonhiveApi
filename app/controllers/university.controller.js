const db = require("../models")
const universityUser = db.user

exports.getAllUniversity = async (req, res) => {
    try {
        const allUniversityUser = []

        const allUser = await universityUser.findAll()

        for (let i = 0; i < allUser.length; i++) {
            let userType = allUser[i].uuid.slice(0, 3)

            if (userType == "UNI") {
                allUniversityUser.push(allUser[i])
            }
        }
        res.status(200).send({ success: true, data: allUniversityUser })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }


}