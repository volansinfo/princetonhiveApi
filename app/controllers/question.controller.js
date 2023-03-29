const db = require("../models")
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination")
const uploadFile = require("../middleware/questionUploads")
const question = db.Question
const fs = require("fs");
const sharp = require('sharp');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.questionAdd = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        const newFilename = `${Date.now()}_${req.file.originalname}`;

        await sharp(req.file.buffer).resize({ width: 500, height: 500 }).toFile(__basedir + "/uploads/question/" + newFilename)
        console.log(req.body)
        let token = req.headers["x-access-token"];
        const tokenData = jwt.decode(token);
        const tokenId = tokenData.id;

        const existquestion = await question.findOne({
            where: {
                teacherId: tokenId,
                questionName: req.body.questionName
            }
        })

        if (existquestion) {
            return res.status(400).send({ success: false, message: "Question already exist!" })
        }
        if (!(req.body.questionName).trim()) {
            return res.status(400).send({ message: "Please enter Question name!" });
        }
        if (!(req.body.departments).trim()) {
            return res.status(400).send({ message: "Please enter Department!" });
        }
        if (isNaN(req.body.departments)) {
            return res.status(400).send({ message: "Please enter numeric value in department!" });
        }
        if (!(req.body.level).trim()) {
            return res.status(400).send({ message: "Please enter level!" });
        }
        if (!(req.body.level == 0) && !(req.body.level == 1) && !(req.body.level == 2)) {
            return res.status(400).send({ message: "Invalid input value for enum level!" })
        }

        const extension = req.file.originalname.split(".")[1]
        if (extension == "jpeg" || extension == "jpg" || extension == "png") {

            const ques = await question.create({
                teacherId: tokenData.id,
                questionName: req.body.questionName,
                departments: req.body.departments,
                level: req.body.level,
                questionImgUrl: newFilename || null,
                status: req.body.status ? req.body.status : 1,
            });
        }
        else {
            return res.status(400).send({ success: false, message: "File type does not allow" })
        }

        res.status(200).send({ success: true, message: "Question added successfully!" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
}

exports.getAllQuestion = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/question/';
    try {
        const allQuestion = await question.findAll({
            where: {
                status: "1"
            },
            order: [
                ['id', 'DESC']
            ]
        })
        let fileInfos = [];
        allQuestion.forEach((file) => {
            fileInfos.push({
                id: file.id,
                questionName: file.questionName,
                departments: file.departments,
                level: file.level,
                questionImgUrl: fullUrl + file.questionImgUrl,
                status: file.status,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
            });
        });
        const page = parseInt(req.query.page) || 0;
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

exports.questionDelete = async (req, res) => {
    try {
        const QuestionId = req.params.id;
        if (!(QuestionId)) {
            return res.status(404).send({ message: "Question Not found!" })
        }

        const questiondelete = await question.destroy({
            where: {
                id: QuestionId
            }

        }).then(num => {

            if (num == 1) {

                res.status(200).send({ message: "Question deleted successfully." });
            } else {
                res.status(404).send({ message: "Question Not found!" });
            }

        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const data = await question.findOne({
            where: {
                id: questionId,
            },
        });
        if (!data) {
            return res.status(404).send({ message: "Question Not found!" });
        }
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        const newFilename = `${Date.now()}_${req.file.originalname}`;
        await sharp(req.file.buffer).resize({ width: 500, height: 500 }).toFile(__basedir + "/uploads/question/" + newFilename)

        if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Invalid input value for enum question_status" })
        }
        if (!(req.body.questionName).trim()) {
            return res.status(400).send({ message: "Please enter Question name!" });
        }
        if (!(req.body.departments).trim()) {
            return res.status(400).send({ message: "Please enter Department!" });
        }
        if (isNaN(req.body.departments)) {
            return res.status(400).send({ message: "Please enter numeric value!" });
        }
        if (!(req.body.level).trim()) {
            return res.status(400).send({ message: "Please enter level!" });
        }
        if (!(req.body.level == 0) && !(req.body.level == 1) && !(req.body.level == 2)) {
            return res.status(400).send({ message: "Invalid input value for enum level!" })
        }
        const ques = await question.update({
            questionName: req.body.questionName,
            departments: req.body.departments,
            level: req.body.level,
            questionImgUrl: newFilename,
            status: req.body.status ? req.body.status : 1
        },
            { where: { id: questionId } }
        );
        return res.status(200).send({ message: 'Question updated successfully' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.questionStatus = async (req, res) => {
    try {
        const QuestionId = req.params.id;
        const questionStatus = req.body.status;
        const data = await question.findOne({
            where: {
                id: QuestionId,
            },
        });
        if (!(data)) {
            return res.status(404).send({ message: "Question Not found!" })
        }

        if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Invalid input value for enum question_status" })
        }
        if (questionStatus == 1) {

            const result = await question.update(
                { status: questionStatus },
                { where: { id: QuestionId } }
            )

            res.status(200).send({ message: "Question has been enabled" });
        } else {

            const result = await question.update(
                { status: questionStatus },
                { where: { id: QuestionId } }
            )
            res.status(200).send({ message: "Question has been disabled" });
        }


    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

}