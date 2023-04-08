const db = require("../models")
const studentAIReport = db.studentAIReport

exports.addStudentAIReport = async (req, res) => {
    try {

        const max = 60
        const min = 30

        let yourAverage = Math.floor(Math.random() * (max - min)) + min;
        let industryAverage = Math.floor(Math.random() * (max - min)) + min;
        let intro = Math.floor(Math.random() * (max - min)) + min;
        let bodyLanguage = Math.floor(Math.random() * (max - min)) + min;
        let facialExpression = Math.floor(Math.random() * (max - min)) + min;
        let language = Math.floor(Math.random() * (max - min)) + min;
        let voice = Math.floor(Math.random() * (max - min)) + min;
        let presence = Math.floor(Math.random() * (max - min)) + min;
        let outro = Math.floor(Math.random() * (max - min)) + min;

        let videoQuality = Math.floor(Math.random() * (max - min)) + min;
        


        let AiReport = JSON.stringify({
             yourAverage: yourAverage, 
             industryAverage: industryAverage, 
             videoQuality:videoQuality,
             intro: intro,
             bodyLanguage: bodyLanguage, 
             facialExpression: facialExpression, 
             language: language, 
             voice: voice, 
             presence: presence, 
             outro: outro 
            })

            console.log(AiReport)

        await studentAIReport.create({
            studentId: req.body.studentId,
            teacherId: req.body.teacherId,
            universityId: req.body.universityId,
            studentUUID: req.body.studentUUID,
            aiReport: AiReport,
            totalAverage:yourAverage,
            videoUrl:req.body.videoUrl,
            // aiReport: req.body.aiReport,
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