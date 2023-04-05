const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
var path = require('path');
const multerStorage = multer.memoryStorage();


const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads/gallery/gallerylist/");
        cb(null, __basedir + "/uploads/gallery/gallerydetails/");

    },
    filename: (req, file, cb) => {
        var filetype = file.mimetype;
        var fileformate = filetype.split("/")[1];

        var data = req.body.title;
        var num = data.toLowerCase();
        var imageName = num.replace(/\s+/g, "-");
        cb(null, `${Date.now()}_${imageName}.${fileformate}`)
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: maxSize // 10000000 Bytes = 10 MB
    },
    fileFilter: function (req, file, callback) {
        // console.log(file, "00000000000000")
        var ext = path.extname(file.originalname);
        if (ext != '.png' && ext != '.jpg' && ext != '.jpeg' && ext != '.mp4') {
            return callback(new Error('File type does not allow!'))
        }
        callback(null, true)
    },
});
// let uploadFile = multer({
//     storage: videoStorage,
//     limits: { fileSize: maxSize },
// }).single("imgUrl");

// let uploadFileMiddleware = util.promisify(videoUpload);
module.exports = videoUpload;