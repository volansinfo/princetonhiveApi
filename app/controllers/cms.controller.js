const db = require("../models");
const config = require("../config/auth.config");
const uploadFile = require("../middleware/cmsImage");
const fs = require("fs");

const Page = db.CmsPage;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.pageAdd = async (req, res) => {
  try {

    await uploadFile(req, res);
    // console.log(req.body);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    } else {
      var imgName = req.file.filename;
    }

    var data = req.body.title;

    var num = data.toLowerCase();
    var slug = num.replace(/\s+/g, '-');
    // console.log(req.file.originalname.split(".")[1], "************")
    if (!(req.body.title)) {
      return res.status(400).send({ message: "Please enter title!" })
    }
    if (!(req.body.description)) {
      return res.status(400).send({ message: "Please enter description!" })
    }
    if (!(req.body.status)) {
      return res.status(400).send({ message: "Please enter value for enum enum_Cms_status" })
    }
    else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum enum_Cmsstatus" })
    }
    const extension = req.file.originalname.split(".")[1]
    if (extension == "jpeg" || extension == "jpg" || extension == "png") {

      const page = await Page.create({
        title: req.body.title,
        description: req.body.description,
        pageSlug: slug,
        fileSrc: imgName,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        metaKeywords: req.body.metaKeywords,
        status: req.body.status

      });
    }
    else {
      return res.status(400).send({ success: false, message: "File type does not allow" })
    }
    res.status(200).send({ message: "Page add successfully:" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.getPages = async (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + '/vol/img/cms/';

  try {
    let data = await Page.findAll();

    let cmsInfos = [];

    data.forEach((datainfo) => {
      if (datainfo.fileSrc != null || datainfo.fileSrc == '') {
        var imgUrl = fullUrl + datainfo.fileSrc;
      } else {
        var imgUrl = '';
      }
      cmsInfos.push({
        id: datainfo.id,
        title: datainfo.title,
        description: datainfo.description,
        pageSlug: datainfo.urlLink,
        fileSrc: imgUrl,
        metaTitle: datainfo.metaTitle,
        metaDescription: datainfo.metaDescription,
        metaKeywords: datainfo.metaKeywords,
        status: datainfo.status,
        createdAt: datainfo.createdAt,
        updatedAt: datainfo.updatedAt,
      });
    });

    let response = {
      pageData: cmsInfos
    }
    res.status(200).json(response);

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

}

exports.updatePage = async (req, res) => {
  try {
    const pageId = req.params.id;
    const pageData = await Page.findOne({
      where: {
        id: pageId,
      },
    });
    if (!pageData) {
      return res.status(404).send({ message: "Page Not found!" });
    }
    const path = __basedir + "/uploads/cms/" + pageData.fileSrc;

    await uploadFile(req, res);
    if (req.file == undefined) {
      var imgName = null;
    } else {
      var imgName = req.file.filename;
    }

    var data = req.body.title;
    var num = data.toLowerCase();
    var slug = num.replace(/\s+/g, '-');


    if (!(req.body.title)) {
      return res.status(400).send({ message: "Please enter title!" })
    }
    if (!(req.body.description)) {
      return res.status(400).send({ message: "Please enter description!" })
    }
    if (!(req.body.status)) {
      return res.status(400).send({ message: "Please enter value for enum enum_Cms_status" })
    }
    else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum enum_Cmsstatus" })
    }
    const extension = req.file.originalname.split(".")[1]
    if (extension == "jpeg" || extension == "jpg" || extension == "png") {
      const page = await Page.update({
        title: req.body.title,
        description: req.body.description,
        pageSlug: slug,
        fileSrc: imgName,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        metaKeywords: req.body.metaKeywords,
        status: req.body.status
      },
        { where: { id: pageId } }

      );
    }
    else {
      return res.status(400).send({ success: false, message: "File type does not allow" })
    }

    if (fs.existsSync(path)) {
      const removeImage = await fs.unlinkSync(__basedir + "/uploads/cms/" + pageData.fileSrc);
    }

    return res.status(200).send({ message: 'Page data updated successfully!' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

exports.pagestatus = async (req, res) => {
  try {
    const pageId = req.params.id;
    const pageStatus = req.body.status;
    if (pageStatus == 1) {

      const result = await Page.update(
        { status: pageStatus },
        { where: { id: pageId } }
      )

      res.status(200).send({ message: "Page has been active!" });
    } else {

      const result = await Page.update(
        { status: pageStatus },
        { where: { id: pageId } }
      )
      res.status(200).send({ message: "Page has been deactivate!" });
    }

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

}

exports.pageDelete = async (req, res) => {
  try {
    const pageId = req.params.id;

    const page = await Page.findOne({
      where: {
        id: pageId,
      },
    });
    if (!page) {
      return res.status(404).send({ message: "Page Not found!" });
    }

    const pagedelete = await Page.destroy({
      where: {
        id: pageId
      }
    })

    // const path = __basedir + "/uploads/cms/" + page.fileSrc;

    // if (fs.existsSync(path)) {
    //   const pagedelete = await Page.destroy({
    //     where: {
    //       id: pageId
    //     }
    // })
    // const removeImage = await fs.unlinkSync(__basedir + "/uploads/cms/" + page.fileSrc);
    // }



    res.status(200).send({ message: "Page was deleted successfully!" });

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}