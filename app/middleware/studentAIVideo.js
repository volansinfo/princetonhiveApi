const util = require("util")
const multer = require("multer")
const maxSize = 200 * 1024 * 1024

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads/studentai/")
    },
    filename: (req, file, cb) => {
        var fileType = file.mimetype
        var fileformate = fileType.split("/")[1]

        var imageName = req.body.studentUUID

        cb(null, `${Date.now()}_${imageName}.${fileformate}`)
    }
})


const uploadFile = multer({
    storage: storage,
    limits: {
        fieldSize: maxSize
    }
}).single("videoFile")

let uploadVideo = util.promisify(uploadFile)
module.exports = uploadVideo