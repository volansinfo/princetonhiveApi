const db = require("../models")
const studentAIReport = db.studentAIReport

exports.addStudentAIReport = async (req, res) => {
    try {

        await studentAIReport.create({
            studentId: req.body.studentId,
            teacherId: req.body.teacherId,
            universityId: req.body.universityId,
            studentUUID: req.body.studentUUID,
            aiReport: req.body.aiReport,
            status: req.body.status ? req.body.status : 1

        })

        return res.status(200).send({ success: true, message: "AI Report received successfully." })

    } catch (e) {
        return res.status(500).send({ success: false, message: e.message })
    }
}

exports.getAllAIReport = async (req, res) => {
    try {

        const AIReport = await studentAIReport.findAll({
            order: [
                ['id', 'DESC']
            ]
        })

        return res.status(200).send({ success: true, AllAIReports: AIReport })

    } catch (e) {
        return res.status(500).send({ success: false, message: e.message })
    }
}

exports.getAIReportDetails = async (req, res) => {
    try {
        const AIReport = await studentAIReport.findOne({
            where: {
                id: req.params.reportId
            }
        })

        if (!AIReport) {
            return res.status(404).send({ success: false, message: "AI Report not found!" });
        }

        return res.status(200).send({ success: true, AIReport: AIReport })

    } catch (e) {
        return res.status(500).send({ success: false, message: e.message })
    }
}