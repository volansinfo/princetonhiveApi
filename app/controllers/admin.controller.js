const db = require("../models")
const pagination = require("../middleware/pagination")
const adminUser = db.user

exports.getAllAdmin = async (req, res) => {
    try {
        const { limit, offset } = pagination.getPagination(req.query.page, 10)

        const allUser = await adminUser.findAndCountAll({
            limit,
            offset,
            attributes: {
                exclude: ['password', 'actualPassword']
            },
            order: [
                ['id', 'DESC']
            ]
        })
        const response = pagination.getPaginationData(allUser, req.query.page, limit)
        res.status(200).json({ success: true, data: response });
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}


