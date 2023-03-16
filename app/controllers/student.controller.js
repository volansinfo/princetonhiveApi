const db = require("../models")
const pagination = require("../middleware/pagination")
const Op = db.Sequelize.Op;
const studentUser = db.user;

exports.getAllStudent = async (req, res) => {
    try {
        const { limit, offset } = pagination.getPagination(req.query.page, 10)
        const results = await studentUser.findAndCountAll({
            limit,
            offset,
            attributes: {
                exclude: ['password', 'actualPassword']
            },
            include: [{
                model: db.role,
                as: "roles",
                where: { id: '4' },
                required: true,
                attributes: []
            }],
            order: [
                ['id', 'DESC']
            ]
        })
        const response = pagination.getPaginationData(results, req.query.page, limit)
        res.status(200).json({ success: true, data: response });
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}
