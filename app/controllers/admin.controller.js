const db = require("../models")
const adminUser = db.user

exports.getAllAdmin = async (req, res) => {
    try {
        const allAdminUser = []

        const allUser = await adminUser.findAll()

        let sorted_data = allUser.sort((a, b) => b.id - a.id);

        for (let i = 0; i < sorted_data.length; i++) {
            let userType = sorted_data[i].uuid.slice(0, 3)

            if (userType == "ADM") {
                allAdminUser.push(sorted_data[i])
            }
        }
        const page = parseInt(req.query.page)
        const limit = 10

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}
        results.totalItems = allAdminUser.length;
        results.totalPages = Math.ceil((allAdminUser.length) / limit);
        results.currentPage = parseInt(req.query.page);
        results.dataItems = allAdminUser.slice(startIndex, endIndex)
        if (parseInt(req.query.page) > Math.ceil((allAdminUser.length) / limit) || parseInt(req.query.page) < 1) {
            return res.status(404).send({ success: false, message: "Page Not found!" })
        }
        res.status(200).json({ success: true, data: results });
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }


}


