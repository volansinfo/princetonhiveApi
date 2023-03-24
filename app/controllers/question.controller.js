const db = require("../models")
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination")
const uploadFile = require("../middleware/questionUploads")
const question = db.Question

exports.questionAdd = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        const ques = await question.create({
            questionName: req.body.questionName,
            departments: req.body.departments,
            level: req.body.level,
            questionImgUrl: req.file.filename,
            status: req.body.status ? req.body.status : 1,
        });

        res.status(200).send({ success: true, message: "Question added successfully!" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
}