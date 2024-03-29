const db = require("../models")
const config = require("../config/auth.config");

const uploadVideo = require("../middleware/galleryVideoUploads")
const gallery = db.Gallery
const fs = require("fs");
const sharp = require('sharp');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.galleryAdd = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        if (req.file.originalname.split(".")[1] == "jpg" || req.file.originalname.split(".")[1] == "jpeg" || req.file.originalname.split(".")[1] == "png" || req.file.originalname.split(".")[1] == "mp4") {
            if ((req.file.mimetype != 'video/mp4')) {
                if (!req.body.galleryType) {
                    return res.status(400).send({ success: false, message: "Please enter gallery type!" })
                }
                if (req.body.galleryType == "1") {
                    if (req.file == undefined) {
                        return res.status(400).send({ message: "Please upload a file!" });
                    }
                    if (req.file.size < 50 * 1024) {
                        return res.status(400).send({ success: false, message: "File too small, please upload a image greater than 50kb" })
                    }
                    if (req.file.size > 3 * 1024 * 1024) {
                        return res.status(400).send({ success: false, message: "File too larg, please upload a image less than 3mb" })
                    }

                    const newFilename = `${Date.now()}_${req.file.originalname}`;
                    await sharp(req.file.path).resize({ width: 520, height: 348 }).toFile(__basedir + "/uploads/gallery/gallerylist/" + newFilename)
                    await sharp(req.file.path).resize({ width: 1420, height: 732 }).toFile(__basedir + "/uploads/gallery/gallerydetails/" + newFilename)

                    if (!(req.body.title).trim()) {
                        return res.status(400).send({ message: "Please enter title!" });
                    }
                    if ((req.body.title).length > 200) {
                        return res.status(400).send({ success: false, message: "Title length should be less than 200 character!" })
                    }
                    const existgallery = await gallery.findOne({
                        where: {
                            title: req.body.title
                        }
                    })
                    if (existgallery) {
                        return res.status(400).send({ success: false, message: "Gallery already exist!" })
                    }
                    if (!(req.body.galleryType).trim()) {
                        return res.status(400).send({ message: "Please enter galleryType!" });
                    }
                    if (!(req.body.galleryType == 1) && !(req.body.galleryType == 2)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery type!" });
                    }
                    if (!req.body.status) {
                        return res
                            .status(400)
                            .send({ message: "Please enter gallery status!" });
                    }
                    if (!(req.body.status == 0) && !(req.body.status == 1)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery_status!" });
                    }
                    const result = await gallery.create({
                        title: req.body.title,
                        imgUrl: newFilename || null,
                        galleryType: req.body.galleryType,
                        status: req.body.status,
                    });
                }
                else {
                    return res.status(400).send({ success: false, message: "Invalid gallery type for image!" })
                }

            }
            else {
                if (!req.body.galleryType) {
                    return res.status(400).send({ success: false, message: "Please enter gallery type!" })
                }
                if (req.body.galleryType == "2") {
                    if (req.file == undefined) {
                        return res.status(400).send({ message: "Please upload a file!" });
                    }
                    if (req.file.size < 1 * 1024 * 1024) {
                        return res.status(400).send({ success: false, message: "File too small, please upload a image greater than 1mb" })
                    }
                    if (req.file.size > 200 * 1024 * 1024) {
                        return res.status(400).send({ success: false, message: "File too larg, please upload a video less than 10mb" })
                    }
                    if (!(req.body.title).trim()) {
                        return res.status(400).send({ message: "Please enter title!" });
                    }
                    if ((req.body.title).length > 200) {
                        return res.status(400).send({ success: false, message: "Title length should be less than 200 character!" })
                    }
                    const existgallery = await gallery.findOne({
                        where: {
                            title: req.body.title
                        }
                    })
                    if (existgallery) {
                        return res.status(400).send({ success: false, message: "Gallery already exist!" })
                    }
                    if (!(req.body.galleryType).trim()) {
                        return res.status(400).send({ message: "Please enter gallery type!" });
                    }
                    if (!(req.body.galleryType == 1) && !(req.body.galleryType == 2)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery type!" });
                    }
                    if (!req.body.status) {
                        return res
                            .status(400)
                            .send({ message: "Please enter gallery status!" });
                    }
                    if (!(req.body.status == 0) && !(req.body.status == 1)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery_status!" });
                    }
                    const result = await gallery.create({
                        title: req.body.title,
                        imgUrl: req.file.filename || null,
                        galleryType: req.body.galleryType,
                        status: req.body.status,
                    });
                }
                else {
                    return res.status(400).send({ success: false, message: "Invalid gallery type for video!" })
                }
            }
            res.status(200).send({ success: true, message: "Gallery added successfully!" });
        }
        else {
            return res.status(400).send({ success: false, message: "File type does not allow!" })
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
}



exports.getAllGallery = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/gallery/gallerylist/';
    try {
        const allGallery = await gallery.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
        let fileInfos = [];
        allGallery.forEach((file) => {
            fileInfos.push({
                id: file.id,
                title: file.title,
                imgUrl: fullUrl + file.imgUrl,
                galleryType: file.galleryType,
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

exports.getActiveGallery = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/gallery/gallerylist/';
    var fullUrldetails = req.protocol + '://' + req.get('host') + '/princetonhive/img/gallery/gallerydetails/';
    try {
        const allGallery = await gallery.findAll({
            where: {
                status: "1"
            },
            order: [
                ['id', 'DESC']
            ]
        })
        let fileInfos = [];
        allGallery.forEach((file) => {
            fileInfos.push({
                id: file.id,
                title: file.title,
                imgUrllist: fullUrl + file.imgUrl,
                imgUrlDetails: fullUrldetails + file.imgUrl,
                galleryType: file.galleryType,
                status: file.status
            });
        });
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 12;

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

exports.updateGallery = async (req, res) => {
    try {
        const galleryId = req.params.id;
        const result = await gallery.findOne({
            where: {
                id: galleryId,
            },
        });
        if (!result) {
            return res.status(404).send({ message: "Gallery Not found!" });
        }
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        if (req.file.originalname.split(".")[1] == "jpg" || req.file.originalname.split(".")[1] == "jpeg" || req.file.originalname.split(".")[1] == "png" || req.file.originalname.split(".")[1] == "mp4") {
            if ((req.file.mimetype != 'video/mp4')) {
                if (!req.body.galleryType) {
                    return res.status(400).send({ success: false, message: "Please enter gallery type!" })
                }
                if (req.body.galleryType == "1") {
                    if (req.file == undefined) {
                        return res.status(400).send({ message: "Please upload a file!" });
                    }
                    if (req.file.size < 50 * 1024) {
                        return res.status(400).send({ success: false, message: "File too small, please select a image greater than 50kb" })
                    }
                    if (req.file.size > 3 * 1024 * 1024) {
                        return res.status(400).send({ success: false, message: "File too larg, please upload a image less than 3mb" })
                    }
                    const newFilename = `${Date.now()}_${req.file.originalname}`;

                    await sharp(req.file.path).resize({ width: 520, height: 348 }).toFile(__basedir + "/uploads/gallery/gallerylist/" + newFilename)
                    await sharp(req.file.path).resize({ width: 1420, height: 732 }).toFile(__basedir + "/uploads/gallery/gallerydetails/" + newFilename)

                    if (!(req.body.title).trim()) {
                        return res.status(400).send({ message: "Please enter title!" });
                    }
                    if ((req.body.title).length > 200) {
                        return res.status(400).send({ success: false, message: "Title length should be less than 200 character!" })
                    }

                    if (!(req.body.galleryType).trim()) {
                        return res.status(400).send({ message: "Please enter gallery type!" });
                    }
                    if (!(req.body.galleryType == 1) && !(req.body.galleryType == 2)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery type!" });
                    }
                    if (!req.body.status) {
                        return res
                            .status(400)
                            .send({ message: "Please enter gallery status!" });
                    }
                    if (!(req.body.status == 0) && !(req.body.status == 1)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery_status!" });
                    }
                    const result = await gallery.update({
                        title: req.body.title,
                        imgUrl: newFilename || null,
                        galleryType: req.body.galleryType,
                        status: req.body.status,
                    },
                        {
                            where:
                            {
                                id: galleryId
                            }
                        });
                }
                else {
                    return res.status(400).send({ success: false, message: "Invalid gallery type for image!" })
                }

            }
            else {
                if (!req.body.galleryType) {
                    return res.status(400).send({ success: false, message: "Please enter gallery type!" })
                }
                if (req.body.galleryType == "2") {
                    if (req.file == undefined) {
                        return res.status(400).send({ message: "Please upload a file!" });
                    }
                    if (req.file.size < 1 * 1024 * 1024) {
                        return res.status(400).send({ success: false, message: "File too small, please select a video greater than 1mb" })
                    }
                    if (req.file.size > 200 * 1024 * 1024) {
                        return res.status(400).send({ success: false, message: "File too larg, please upload a video less than 10mb" })
                    }
                    if (!(req.body.title).trim()) {
                        return res.status(400).send({ message: "Please enter title!" });
                    }
                    if ((req.body.title).length > 200) {
                        return res.status(400).send({ success: false, message: "Title length should be less than 200 character!" })
                    }

                    if (!(req.body.galleryType).trim()) {
                        return res.status(400).send({ message: "Please enter gallery type!" });
                    }
                    if (!(req.body.galleryType == 1) && !(req.body.galleryType == 2)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery type!" });
                    }
                    if (!req.body.status) {
                        return res
                            .status(400)
                            .send({ message: "Please enter gallery status!" });
                    }
                    if (!(req.body.status == 0) && !(req.body.status == 1)) {
                        return res
                            .status(400)
                            .send({ message: "Invalid input value for gallery_status!" });
                    }
                    const result = await gallery.update({
                        title: req.body.title,
                        imgUrl: req.file.filename || null,
                        galleryType: req.body.galleryType,
                        status: req.body.status,
                    }, {
                        where:
                        {
                            id: galleryId
                        }
                    });
                }
                else {
                    return res.status(400).send({ success: false, message: "Invalid gallery type for video!" })
                }
            }
            return res.status(200).send({ message: 'Gallery updated successfully' });
        }
        else {
            return res.status(400).send({ success: false, message: "File type does not allow!" })
        }
    } catch (error) {

        return res.status(500).send({ success: false, message: error.message });

    }
}

exports.galleryDelete = async (req, res) => {
    try {
        const GalleryId = req.params.id;
        if (!(GalleryId)) {
            return res.status(404).send({ message: "Gallery Not found!" })
        }

        const gallerydelete = await gallery.destroy({
            where: {
                id: GalleryId
            }

        }).then(num => {

            if (num == 1) {

                res.status(200).send({ message: "Gallery deleted successfully." });
            } else {
                res.status(404).send({ message: "Gallery Not found!" });
            }

        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.galleryStatus = async (req, res) => {
    try {
        const galleryId = req.params.id;
        const galleryStatus = req.body.status;
        const data = await gallery.findOne({
            where: {
                id: galleryId,
            },
        });
        if (!(data)) {
            return res.status(404).send({ message: "Gallery Not found!" })
        }

        if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Invalid input value for enum gallery_status" })
        }
        if (galleryStatus == 1) {

            const result = await gallery.update(
                { status: galleryStatus },
                { where: { id: galleryId } }
            )

            res.status(200).send({ message: "Gallery has been enabled" });
        } else {

            const result = await gallery.update(
                { status: galleryStatus },
                { where: { id: galleryId } }
            )
            res.status(200).send({ message: "Gallery has been disabled" });
        }


    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

}