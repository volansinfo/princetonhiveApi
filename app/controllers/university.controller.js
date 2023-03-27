const db = require("../models")
const pagination = require("../middleware/pagination")
const Op = db.Sequelize.Op;
const universityUser = db.user

exports.getAllUniversity = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/user/';
    try {
        const allUser = await universityUser.findAll({
            attributes: {
                exclude: ['password', 'actualPassword']
            },
            include: [{
                model: db.role,
                as: "roles",
                where: { id: '2' },
                required: true,
                attributes: []
            }],
            order: [
                ['id', 'DESC']
            ]
        })
        let fileInfos = [];
        allUser.forEach((file) => {
            fileInfos.push({
                id: file.id,
                fname: file.fname,
                lname: file.lname,
                profileImg: fullUrl + file.profileImg,
                email: file.email,
                mnumber: file.mnumber,
                address: file.address,
                city: file.city,
                state: file.state,
                pincode: file.pincode,
                gender: file.gender,
                dob: file.dob,
                country: file.country,
                status: file.status,
                uuid: file.uuid,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
            });
        });
        const page = parseInt(req.query.page) || 0;
        if (page < 0) {
            return res.status(400).send({ success: false, message: "Page must not be negative!" })
        }
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = page * limit;
        const endIndex = (page + 1) * limit;

        const results = {};
        results.dataItems = fileInfos.slice(startIndex, endIndex)
        results.totalItems = fileInfos.length;
        results.currentPage = parseInt(req.query.page) || 0;
        results.totalPages = Math.ceil((fileInfos.length) / limit);

        res.status(200).json({ success: true, data: results });
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}