const db = require("../models")
const Op = db.Sequelize.Op;
const studentUser = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uploadFile = require("../middleware/authUserImage");
const fs = require("fs");
const sharp = require("sharp");


exports.getAllStudentByTeacher = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/user/';
    try {
        let token = req.headers["x-access-token"];

        const tokenData = jwt.decode(token);
        const teacherId = tokenData.id
        const allUser = await studentUser.findAll({
            where: {
                teacherId: teacherId
            },
            order: [
                ['id', 'DESC']
            ]
        })
        let fileInfos = [];
        allUser.forEach((file) => {
            if (file.profileImg !== null) {
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
                    teacherId: file.teacherId,
                    studentId: file.studentId,
                    createdAt: file.createdAt,
                    updatedAt: file.updatedAt,
                });
            } else {
                fileInfos.push({
                    id: file.id,
                    fname: file.fname,
                    lname: file.lname,
                    profileImg: "",
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
                    teacherId: file.teacherId,
                    studentId: file.studentId,
                    createdAt: file.createdAt,
                    updatedAt: file.updatedAt,
                });
            }
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

exports.getAllStudentsCountByTeacher = async (req, res) => {
    try {
        let token = req.headers["x-access-token"];

        const tokenData = jwt.decode(token);
        const teacherId = tokenData.id
        const allUser = await studentUser.findAll({
            where: {
                teacherId: teacherId
            },
            order: [
                ['id', 'DESC']
            ]
        })
        totalStudents = allUser.length;
        return res.status(200).send({ success: true, totalStudents })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}

exports.updateStudentData = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file !== undefined) {
            if (req.file.size < 2 * 1024) {
                return res.status(400).send({ success: false, message: "File too small, please select a file greater than 2kb" })
            }
            const newFilename = `${Date.now()}_${req.file.originalname}`;
            await sharp(req.file.buffer).resize({ width: 67, height: 67 }).toFile(__basedir + "/uploads/user/" + newFilename)
            // first name validation
            if (!(req.body.fname).trim()) {
                return res.status(400).send({ message: "Please enter first name!" })
            }
            // pincode validation
            if (!(req.body.pincode).trim()) {
                return res.status(400).send({ message: "Please enter pincode!" })
            }
            else if ((req.body.pincode.length > 10) || (req.body.pincode.length < 5)) {
                return res.status(400).send({ message: "Please enter valid pincode!" })
            }
            else if (isNaN(req.body.pincode)) {
                return res.status(400).send({ message: "Please enter valid pincode!" })
            }

            if (!(req.body.status)) {
                return res.status(400).send({ message: "Please enter value for enum user_status" })
            }
            else if (!(req.body.status == 0) && !(req.body.status == 1)) {
                return res.status(400).send({ message: "Invalid input value for enum user_status" })
            }
            const studentId = req.params.id;
            const student = await studentUser.findOne({
                where: {
                    id: studentId
                },
            })
            if (!student) {
                return res.status(400).send({ success: false, message: "Student does not exist!" })
            }
            if (student.teacherId == null) {
                return res.status(400).send({ success: false, message: "Please enter Student Id only!" })
            }
            const result = await studentUser.update({
                fname: req.body.fname,
                lname: req.body.lname,
                profileImg: newFilename,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                gender: req.body.gender,
                dob: req.body.dob,
                country: req.body.country,
                status: req.body.status,
            },
                {
                    where:
                    {
                        id: studentId
                    }
                }
            );
            res.status(200).send({ success: true, message: "User data updated successfully." });
        }
        else {
            const newFilename = null;
            if (!(req.body.fname).trim()) {
                return res.status(400).send({ message: "Please enter first name!" })
            }
            // pincode validation
            if (!(req.body.pincode).trim()) {
                return res.status(400).send({ message: "Please enter pincode!" })
            }
            else if ((req.body.pincode.length > 10) || (req.body.pincode.length < 5)) {
                return res.status(400).send({ message: "Please enter valid pincode!" })
            }
            else if (isNaN(req.body.pincode)) {
                return res.status(400).send({ message: "Please enter valid pincode!" })
            }

            if (!(req.body.status)) {
                return res.status(400).send({ message: "Please enter value for enum user_status" })
            }
            else if (!(req.body.status == 0) && !(req.body.status == 1)) {
                return res.status(400).send({ message: "Invalid input value for enum user_status" })
            }
            const studentId = req.params.id;
            const student = await studentUser.findOne({
                where: {
                    id: studentId
                },
            })
            if (student.teacherId == null) {
                return res.status(400).send({ success: false, message: "Please enter Student Id only!" })
            }
            const result = await studentUser.update({
                fname: req.body.fname,
                lname: req.body.lname,
                profileImg: newFilename,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                gender: req.body.gender,
                dob: req.body.dob,
                country: req.body.country,
                status: req.body.status,
            },
                {
                    where:
                    {
                        id: studentId
                    }
                }
            );
            res.status(200).send({ success: true, message: "User data updated successfully." });
        }


    } catch (e) {
        if (e.message == "File type does not allow!") {
            return res.status(400).send({ success: false, message: e.message })
        }
        else if (e.message == "File too large") {
            return res.status(400).send({ success: false, message: "File too large, please select a file less than 3mb" });
        } else {
            return res.status(500).send({ success: false, message: e.message })
        }
    }
}
