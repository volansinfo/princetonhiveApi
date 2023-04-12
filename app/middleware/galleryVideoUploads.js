const util = require("util");
const multer = require("multer");
const maxSize = 200 * 1024 * 1024;
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
const videoUpload = multer(
    {
        storage: videoStorage,
        limits: {
            fileSize: maxSize
        },
    });

// let uploadFileMiddleware = util.promisify(videoUpload);
module.exports = videoUpload;