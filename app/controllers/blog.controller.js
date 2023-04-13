const db = require("../models")
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination")
const uploadFile = require("../middleware/blogUploads")
const blogs = db.Blog
const fs = require("fs");
const sharp = require('sharp');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.blogAdd = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        if (req.file.size < 50 * 1024) {
            return res.status(400).send({ success: false, message: "File too small, please select a file greater than 600kb" })
        }
        const newFilename = `${Date.now()}_${req.file.originalname}`;

        await sharp(req.file.buffer).resize({ width: 418, height: 210 }).toFile(__basedir + "/uploads/blogs/listblogs/" + newFilename)
        await sharp(req.file.buffer).resize({ width: 1254, height: 566 }).toFile(__basedir + "/uploads/blogs/detailblogs/" + newFilename)
        // console.log(req.body)

        if (!(req.body.title).trim()) {
            return res.status(400).send({ message: "Please enter title!" });
        }
        if ((req.body.title).length > 200) {
            return res.status(400).send({ success: false, message: "Title length should be less than 200 character!" })
        }

        const existblog = await blogs.findOne({
            where: {
                title: req.body.title
            }
        })
        if (existblog) {
            return res.status(400).send({ success: false, message: "Blog already exist!" })
        }
        if (!(req.body.description).trim()) {
            return res.status(400).send({ message: "Please enter Description!" });
        }
        // if ((req.body.description).length > 200) {
        //     return res.status(400).send({ success: false, message: "Description length should be less than 200 character!" })
        // }
        var data = req.body.title;

        var num = data.toLowerCase();
        var Slug = num.replace(/\s+/g, '-');

        const blog = await blogs.create({
            title: req.body.title,
            description: req.body.description,
            imgUrl: newFilename || null,
            slug: Slug,
            metaData: req.body.metaData,
            metaKeywords: req.body.metaKeywords,
            metaDescription: req.body.metaDescription,
            status: req.body.status ? req.body.status : 1,
        });
        res.status(200).send({ success: true, message: "Blog added successfully!" });
    } catch (error) {
        if (error.message == "File type does not allow!") {
            return res.status(400).send({ success: false, message: error.message });
        }
        else if (error.message == "File too large") {
            return res.status(400).send({ success: false, message: "File too large, please select a file less than 3mb" });
        } else {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
}

exports.getAllBlogs = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/blogs/listblogs/';
    try {
        const allBlogs = await blogs.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
        let fileInfos = [];
        allBlogs.forEach((file) => {
            fileInfos.push({
                id: file.id,
                title: file.title,
                description:file.description,
                imgUrl: fullUrl + file.imgUrl,
                slug: file.slug,
                metaData: file.metaData,
                metaTitle: file.metaTitle,
                metaDescription: file.metaDescription,
                metaKeywords: file.metaKeywords,
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

exports.getActiveBlogs = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/blogs/detailblogs/';
    try {
        const allBlogs = await blogs.findAll({
            where: {
                status: "1"
            },
            order: [
                ['id', 'DESC']
            ]
        })
        let fileInfos = [];
        allBlogs.forEach((file) => {
            fileInfos.push({
                id: file.id,
                title: file.title,
                description:file.description,
                imgUrl: fullUrl + file.imgUrl,
                slug: file.slug,
                metaData: file.metaData,
                metaTitle: file.metaTitle,
                metaDescription: file.metaDescription,
                metaKeywords: file.metaKeywords,
                status: file.status,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
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

exports.getBlogById = async (req, res) => {
    try {
        var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/blogs/listblogs/';
        const blogId = req.params.id;
        const blogData = await blogs.findOne({
            where: {
                id: blogId,
            },
        });
        if (!blogData) {
            return res.status(404).send({ success: false, message: "Blog Not found!" });
        }
        blogData.imgUrl = fullUrl + blogData.imgUrl
        res.status(200).json({ success: true, data: blogData });

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }

};

exports.getBlogBySlug = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/blogs/detailblogs/';
    try {
        const blogSlug = req.params.slug;
        const blogData = await blogs.findOne({
            where: {
                slug: blogSlug,
            },
        });
        if (!blogData) {
            return res.status(404).send({ success: false, message: "Blog Not found!" });
        }
        blogData.imgUrl = fullUrl + blogData.imgUrl

        res.status(200).json({ success: true, data: blogData });

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }

};

exports.blogDelete = async (req, res) => {
    try {
        const BlogId = req.params.id;
        if (!(BlogId)) {
            return res.status(404).send({ message: "Blog Not found!" })
        }

        const blogdelete = await blogs.destroy({
            where: {
                id: BlogId
            }

        }).then(num => {

            if (num == 1) {

                res.status(200).send({ message: "Blog deleted successfully." });
            } else {
                res.status(404).send({ message: "Blog Not found!" });
            }

        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const result = await blogs.findOne({
            where: {
                id: blogId,
            },
        });
        if (!result) {
            return res.status(404).send({ message: "Blog Not found!" });
        }
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        if (req.file.size < 2 * 1024) {
            return res.status(400).send({ success: false, message: "File too small, please select a file greater than 600kb" })
        }
        const newFilename = `${Date.now()}_${req.file.originalname}`;
        await sharp(req.file.buffer).resize({ width: 418, height: 210 }).toFile(__basedir + "/uploads/blogs/listblogs/" + newFilename)
        await sharp(req.file.buffer).resize({ width: 1254, height: 566 }).toFile(__basedir + "/uploads/blogs/detailblogs/" + newFilename)

        if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Invalid input value for enum blog_status" })
        }
        if (!(req.body.title).trim()) {
            return res.status(400).send({ message: "Please enter Blog title!" });
        }
        if ((req.body.title).length > 200) {
            return res.status(400).send({ success: false, message: "Title length should be less than 200 character!" })
        }
        if (!(req.body.description).trim()) {
            return res.status(400).send({ message: "Please enter Description!" });
        }
        // if ((req.body.description).length > 200) {
        //     return res.status(400).send({ success: false, message: "Description length should be less than 200 character!" })
        // }
        var data = req.body.title;
        var num = data.toLowerCase();
        var Slug = num.replace(/\s+/g, '-');

        const blog = await blogs.update({
            title: req.body.title,
            imgUrl: newFilename,
            description: req.body.description,
            slug: Slug,
            metaData: req.body.metaData,
            metaKeywords: req.body.metaKeywords,
            metaDescription: req.body.metaDescription,
            status: req.body.status ? req.body.status : 1,
        },
            { where: { id: blogId } }
        );
        return res.status(200).send({ message: 'Blog updated successfully' });
    } catch (error) {
        if (error.message == "File type does not allow!") {
            return res.status(400).send({ success: false, message: error.message });
        }
        else if (error.message == "File too large") {
            return res.status(400).send({ success: false, message: "File too large, please select a file less than 3mb" });
        } else {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
}

exports.blogStatus = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blogStatus = req.body.status;
        const data = await blogs.findOne({
            where: {
                id: blogId,
            },
        });
        if (!(data)) {
            return res.status(404).send({ message: "Blog Not found!" })
        }

        if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Invalid input value for enum blog_status" })
        }
        if (blogStatus == 1) {

            const result = await blogs.update(
                { status: blogStatus },
                { where: { id: blogId } }
            )

            res.status(200).send({ message: "Blog has been enabled" });
        } else {

            const result = await blogs.update(
                { status: blogStatus },
                { where: { id: blogId } }
            )
            res.status(200).send({ message: "Blog has been disabled" });
        }


    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

}