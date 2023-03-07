const db = require("../models")
const adminUser = db.user

exports.getAllAdmin = async (req, res) => {
    try {
        const allAdminUser = []

        const allUser = await adminUser.findAll()

        for (let i = 0; i < allUser.length; i++) {
            let userType = allUser[i].uuid.slice(0, 3)

            if (userType == "ADM") {
                allAdminUser.push(allUser[i])
            }
        }
        res.status(200).send({ success: true, data: allAdminUser })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }


}


