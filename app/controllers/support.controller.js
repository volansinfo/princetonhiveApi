const db = require("../models")
const supportUser = db.user

exports.getAllSupport = async (req, res) => {
    try {
        const allSupportUser = []

        const allUser = await supportUser.findAll()

        for (let i = 0; i < allUser.length; i++) {
            let userType = allUser[i].uuid.slice(0, 3)

            if (userType == "SUP") {
                allSupportUser.push(allUser[i])
            }
        }
        res.status(200).send({ success: true, data: allSupportUser })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }


}


