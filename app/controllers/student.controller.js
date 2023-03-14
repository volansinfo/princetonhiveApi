const db = require("../models")
const studentUser = db.user

exports.getAllStudent = async (req, res) => {
    try {
        const allStudentUser = []

        const allUser = await studentUser.findAll();
        let sorted_data = allUser.sort((a, b) => b.id - a.id);

        for (let i = 0; i < sorted_data.length; i++) {
            let userType = sorted_data[i].uuid.slice(0, 3)

            if (userType == "STU") {
                allStudentUser.push(sorted_data[i])
            }
        }
        // console.log(allStudentUser, "********************************************")
        const page = parseInt(req.query.page)
        const limit = 10

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}
        results.totalItems = allStudentUser.length;
        results.totalPages = Math.ceil((allStudentUser.length) / limit);
        results.currentPage = parseInt(req.query.page);
        results.dataItems = allStudentUser.slice(startIndex, endIndex)
        if (parseInt(req.query.page) > Math.ceil((allStudentUser.length) / limit) || parseInt(req.query.page) < 1) {
            return res.status(404).send({ success: false, message: "Page Note found!" })
        }
        res.status(200).json({ success: true, data: results });
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }


}
