const db = require("../models")
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination")
const uploadFile = require("../middleware/questionUploads")
const question = db.Question
const fs = require("fs");

exports.questionAdd = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        const existquestion = await question.findOne({
            where: {
                questionName: (req.body.questionName).trim()
            }
        })

        if (existquestion) {
            return res.status(400).send({ success: false, message: "Question already exist!" })
        }
        const extension = req.file.originalname.split(".")[1]
        if (extension == "jpeg" || extension == "jpg" || extension == "png") {

            const ques = await question.create({
                questionName: req.body.questionName,
                departments: req.body.departments,
                level: req.body.level,
                questionImgUrl: req.file.filename,
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
        const data = await question.findOne({
            where: {
                id: QuestionId,
            },
        });
        if (!data) {
            return res.status(404).send({ message: "Question Not found!" });
        }
        const path = __basedir + "/uploads/question/" + data.questionImgUrl;

        if (fs.existsSync(path)) {

            const questiondelete = await question.destroy({
                where: {
                    id: QuestionId
                }
            })
            const removeImage = await fs.unlinkSync(__basedir + "/uploads/question/" + data.questionImgUrl);
        }
        res.status(200).send({ message: "Question deleted successfully!" });

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
        const path = __basedir + "/uploads/question/" + data.filename;
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        else if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Invalid input value for enum question_status" })
        }

        const extension = req.file.originalname.split(".")[1]
        if (extension == "jpeg" || extension == "jpg" || extension == "png") {

            const data = await question.update({
                questionName: req.body.questionName,
                departments: req.body.departments,
                level: req.body.level,
                questionImgUrl: req.file.filename,
                status: req.body.status
            },
                { where: { id: questionId } }

            );
        }
        else {
            return res.status(400).send({ success: false, message: "File type does not allow" })
        }
        if (fs.existsSync(path)) {
            const removeImage = await fs.unlinkSync(__basedir + "/uploads/question/" + data.filename);
        }
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

            res.status(200).send({ message: "Question has been active" });
        } else {

            const result = await question.update(
                { status: questionStatus },
                { where: { id: QuestionId } }
            )
            res.status(200).send({ message: "Question has been disable" });
        }


    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

}