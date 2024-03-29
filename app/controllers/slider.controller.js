const db = require("../models");
const config = require("../config/auth.config");
const uploadFile = require("../middleware/upload");
const fs = require("fs");
const User = db.user;
const Role = db.role;
const Slider = db.slider;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.bannerSliderAdd = async (req, res) => {
  try {

    await uploadFile(req, res);
    //console.log(req.file.path);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    if (!(req.body.title)) {
      return res.status(400).send({ message: "Please enter title!" })
    }
    if (!(req.body.status)) {
      return res.status(400).send({ message: "Please enter value for enum enum_hiv_sliders_status" })
    }
    else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum enum_hiv_sliders_status" })
    }
    const extension = req.file.originalname.split(".")[1]
    if (extension == "jpeg" || extension == "jpg" || extension == "png") {
      const user = await Slider.create({
        title: req.body.title,
        path: req.file.path,
        fileSrc: req.file.filename,
        urlLink: req.body.urlLink,
        status: req.body.status

      });
    }
    else {
      return res.status(400).send({ success: false, message: "File type does not allow" })
    }

    res.status(200).send({ message: "File uploaded successfully:" });
  } catch (error) {
    return res.status(500).send({ message: `Could not upload the file: ${req.file.originalname}. ${error.message}`, });
  }
};

exports.findSlider = async (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + '/princetonhive/img/slider/';
  try {
    let data = await Slider.findAll({
      where: {
        status: ["0", "1"],
      },
      order: [
        ['id', 'DESC']
      ]
    });

    if (data == '') {
      return res.status(404).send({ message: "Slider status has been pending!" });
    }
    let fileInfos = [];

    data.forEach((file) => {
      fileInfos.push({
        id: file.id,
        title: file.title,
        path: fullUrl + file.fileSrc,
        urlLink: file.urlLink,
        status: file.status,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      });
    });

    const page = parseInt(req.query.page) || 0;
    if (page < 0) {
      return res.status(400).send({ success: false, message: "Page must not be negative!" })
    }
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = fileInfos.slice(startIndex, endIndex)
    results.totalItems = fileInfos.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil((fileInfos.length) / limit);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

}

exports.updateSlider = async (req, res) => {
  try {
    const SliderId = req.params.id;
    const slider = await Slider.findOne({
      where: {
        id: SliderId,
      },
    });
    if (!slider) {
      return res.status(404).send({ message: "slider Not found!" });
    }
    const path = __basedir + "/uploads/slider/" + slider.fileSrc;

    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    if (!(req.body.title)) {
      return res.status(400).send({ message: "Please enter title!" })
    }
    if (!(req.body.status)) {
      return res.status(400).send({ message: "Please enter value for enum enum_hiv_sliders_status" })
    }
    else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum enum_hiv_sliders_status" })
    }
    // else if (!(req.body.status == 1)) {
    //   return res.status(400).send({ message: "Invalid input value for enum enum_hiv_sliders_status" })
    // }

    const extension = req.file.originalname.split(".")[1]
    if (extension == "jpeg" || extension == "jpg" || extension == "png") {

      const user = await Slider.update({
        title: req.body.title,
        path: req.file.path,
        fileSrc: req.file.filename,
        urlLink: req.body.urlLink,
        status: req.body.status
      },
        { where: { id: SliderId } }

      );
    }
    else {
      return res.status(400).send({ success: false, message: "File type does not allow" })
    }


    if (fs.existsSync(path)) {
      const removeImage = await fs.unlinkSync(__basedir + "/uploads/slider/" + slider.fileSrc);
    }

    return res.status(200).send({ message: 'Slider data updated successfully' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

exports.sliderstatus = async (req, res) => {
  try {
    const SliderId = req.params.id;
    const sliderStatus = req.body.status;
    const slider = await Slider.findOne({
      where: {
        id: SliderId,
      },
    });
    if (!(slider)) {
      return res.status(404).send({ message: "User Not found!" })
    }
    else {

      if (!(req.body.status)) {
        return res.status(400).send({ message: "Please enter value for enum slider_status" })
      }
      else if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res.status(400).send({ message: "Invalid input value for enum slider_status" })
      }
    }
    if (sliderStatus == 1) {

      const result = await Slider.update(
        { status: sliderStatus },
        { where: { id: SliderId } }
      )

      res.status(200).send({ message: "Slider has been active" });
    } else {

      const result = await Slider.update(
        { status: sliderStatus },
        { where: { id: SliderId } }
      )
      res.status(200).send({ message: "Slider has been deactivate" });
    }


  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

}

exports.sliderdelete = async (req, res) => {
  try {
    const SliderId = req.params.id;

    const slider = await Slider.findOne({
      where: {
        id: SliderId,
      },
    });
    if (!slider) {
      return res.status(404).send({ message: "slider Not found!" });
    }


    const path = __basedir + "/uploads/slider/" + slider.fileSrc;

    if (fs.existsSync(path)) {

      const sliderdelete = await Slider.destroy({
        where: {
          id: SliderId
        }

      })

      const removeImage = await fs.unlinkSync(__basedir + "/uploads/slider/" + slider.fileSrc);
    }



    res.status(200).send({ message: "Slider was deleted successfully!" });

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}