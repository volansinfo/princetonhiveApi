const db = require("../models")
const pagination = require("../middleware/pagination")
const Op = db.Sequelize.Op;
const universityUser = db.user

exports.getAllUniversity = async (req, res) => {
    try {
        const { limit, offset } = pagination.getPagination(req.query.page, 10)
        const results = await universityUser.findAndCountAll({
            limit,
            offset,
            attributes: {
                exclude: ['password', 'actualPassword']
            },
            include: [{
                model: db.role,
                as: "roles",
                where: { id: '2' },
                required: true,
                right: true,
                attributes: [],
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