const db = require("../models");
const config = require("../config/auth.config");
const uploadFile = require("../middleware/menuMultiUpload");
const fs = require("fs");
const Menu = db.Menu;
const User = db.user
const userPermissions = db.UserPermissions;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getAllMenuList = async (req, res) => {
  try {

    let data = await Menu.findAll({});
    let response = {
      menuData: data
    }

    res.status(200).json(response);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.addMenuList = async (req, res) => {
  try {

    await uploadFile(req, res);

    // console.log(req.files.iconTag[0]);
    // console.log(req.files.iconImage);

    //  if (req.files.iconTag == undefined) {
    //   var iconTag = null;
    //   }else{
    //   var iconTag = req.files.iconTag[0].filename;
    // }

    if (req.file == undefined) {
      var iconImage = null;
    } else {
      var iconImage = req.file.filename;
    }
    if (!(req.body.moduleName)) {
      return res.status(400).send({ message: "Please enter moduleName!" })
    }
    else if (req.body.moduleName != '') {
      var data = req.body.moduleName;
      var num = data.toLowerCase();
      var slug = num.replace(/\s+/g, '-');
    } else {
      var slug = '';
    }
    if (!(req.body.parentId)) {
      return res.status(400).send({ message: "Please enter parentId!" })
    }
    else if (isNaN(req.body.parentId)) {
      return res.status(400).send({ message: "Please enter valid parentId!" })
    }
    if (!(req.body.displayName)) {
      return res.status(400).send({ message: "Please enter displayName!" })
    }
    else {
      var displayName = req.body.displayName
    }

    if (req.body.isParent != '') {
      var isParent = req.body.isParent;
    } else if (!(req.body.isParent)) {
      return res.status(400).send({ message: "Please enter isParent!" });
    }
    else if (!(req.body.isParent == 0) && !(req.body.isParent == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum isParent!" })
    }

    if (!(req.body.isParent)) {
      return res.status(400).send({ message: "Please enter isParent!" });
    }
    else if (!(req.body.isParent == 0) && !(req.body.isParent == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum isParent!" })
    }
    if (req.body.iconTag != '') {
      var iconTag = req.body.iconTag;
    } else {
      var iconTag = null;
    }

    if (!(req.body.status)) {
      return res.status(400).send({ message: "Please enter value for enum enum_Menu_status" })
    }
    else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum enum_Menu_status" })
    }

    const menu = await Menu.create({
      moduleName: req.body.moduleName,
      displayName: req.body.displayName,
      isParent: isParent,
      parentId: req.body.parentId,
      iconTag: iconTag,
      iconImage: iconImage,
      slug: slug,
      status: req.body.status

    });


    res.status(200).send({ message: "Menu created successfully" });

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.updateMenuList = async (req, res) => {
  try {

    var menuId = req.params.id;

    const menu = await Menu.findOne({
      where: {
        id: menuId,
      },
    });
    if (!menu) {
      return res.status(404).send({ message: "Menu Not found!" });
    }

    await uploadFile(req, res);

    if (req.file == undefined) {
      var iconImage = null;
    } else {
      var iconImage = req.file.filename;
    }
    if (!(req.body.moduleName)) {
      return res.status(400).send({ message: "Please enter moduleName!" })
    }

    if (req.body.moduleName != '') {
      var data = req.body.moduleName;
      var num = data.toLowerCase();
      var slug = num.replace(/\s+/g, '-');
    } else {
      var slug = '';
    }

    if (req.body.isParent != '') {
      var isParent = req.body.isParent;
    } else if (!(req.body.isParent)) {
      return res.status(400).send({ message: "Please enter isParent!" });
    }
    else if (!(req.body.isParent == 0) && !(req.body.isParent == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum isParent!" })
    }

    if (!(req.body.parentId)) {
      return res.status(400).send({ message: "Please enter parentId!" })
    }
    if (req.body.iconTag != '') {
      var iconTag = req.body.iconTag;
    } else {
      var iconTag = null;
    }
    if (!(req.body.displayName)) {
      return res.status(400).send({ message: "Please enter displayName!" })
    }
    else {
      var displayName = req.body.displayName
    }

    if (!(req.body.status)) {
      return res.status(400).send({ message: "Please enter value for enum enum_Menu_status" })
    }
    else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res.status(400).send({ message: "Invalid input value for enum enum_Menu_status" })
    }


    const result = await Menu.update({
      moduleName: req.body.moduleName,
      displayName: req.body.displayName,
      isParent: isParent,
      parentId: req.body.parentId,
      iconTag: iconTag,
      iconImage: iconImage,
      slug: slug,
      status: req.body.status
    },
      { where: { id: menuId } }
    );
    res.status(200).send({ message: "Menu data updated successfully" });

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};


exports.deleteMenuList = async (req, res) => {
  try {
    var menuId = req.params.id;

    const menu = await Menu.findOne({
      where: {
        id: menuId,
      },
    });
    if (!menu) {
      return res.status(404).send({ message: "menu Not found!" });
    }

    const path = __basedir + "/uploads/menuicon/" + menu.fileSrc;

    if (fs.existsSync(path)) {

      const menudelete = await Menu.destroy({
        where: {
          id: menuId
        }

      })

      const removeImage = await fs.unlinkSync(__basedir + "/uploads/menuicon/" + menu.fileSrc);
    } else {
      const menudelete = await Menu.destroy({
        where: {
          id: menuId
        }

      })
    }


    res.status(200).send({ message: "Menu deleted successfully" });


  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.statusMenuList = async (req, res) => {
  try {

    const menuId = req.params.id;
    const menuStatus = req.body.status;
    const menu = await Menu.findOne({
      where: {
        id: menuId,
      },
    });
    if (!(menu)) {
      return res.status(404).send({ message: "User Not found!" })
    }
    else {

      if (!(req.body.status)) {
        return res.status(400).send({ message: "Please enter value for enum menu_status" })
      }
      else if (!(req.body.status == 0) && !(req.body.status == 1)) {
        return res.status(400).send({ message: "Invalid input value for enum menu_status" })
      }
    }
    if (menuStatus == 1) {

      const result = await Menu.update(
        { status: menuStatus },
        { where: { id: menuId } }
      )

      res.status(200).send({ message: "Menu has been active" });
    } else {

      const result = await Menu.update(
        { status: menuStatus },
        { where: { id: menuId } }
      )
      res.status(200).send({ message: "Menu has been deactivate" });
    }

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.addUac = async (req, res) => {
  try {

    var allPermissionData = req.body.permissionsData.map(function (item) {
      return item;
    });

    if ((allPermissionData[0].userId).trim() == "" || (req.body.userId).trim() == "") {
      return res.status(400).send({ success: false, message: "Please enter userId!" })
    }
    const user = await User.findOne({
      where: {
        id: req.body.userId,
      },
    });
    if (!user) {
      return res.status(404).send({ success: false, message: "User Not found!" })
    }
    if (req.body.userId != allPermissionData[0].userId) {
      return res.status(400).send({ success: false, message: "UserId does not match!" })
    }

    if ((allPermissionData[0].moduleId).trim() == "") {
      return res.status(400).send({ success: false, message: "Please enter moduleId!" })
    }
    const menu = await Menu.findOne({
      where: {
        id: allPermissionData[0].moduleId,
      },
    });

    if (!menu) {
      return res.status(404).send({ success: false, message: "Module Not found!" })
    }

    if ((allPermissionData[0].isAdd).trim() == "") {
      return res.status(400).send({ success: false, message: "Please enter isAdd!" })
    }
    else if ((allPermissionData[0].isAdd) != "0" && (allPermissionData[0].isAdd) != "1") {
      return res.status(400).send({ success: false, message: "Please enter 0 & 1 only for isAdd!" })
    }

    if ((allPermissionData[0].isUpdate).trim() == "") {
      return res.status(400).send({ success: false, message: "Please enter isUpdate!" })
    }
    else if (allPermissionData[0].isUpdate != "0" && allPermissionData[0].isUpdate != "1") {
      return res.status(400).send({ success: false, message: "Please enter 0 & 1 only for isUpdate!" })
    }

    if ((allPermissionData[0].isRead).trim() == "") {
      return res.status(400).send({ success: false, message: "Please enter isRead!" })
    }
    else if (allPermissionData[0].isRead != "0" && allPermissionData[0].isRead != "1") {
      return res.status(400).send({ success: false, message: "Please enter 0 & 1 only for isRead!" })
    }

    if ((allPermissionData[0].isDelete).trim() == "") {
      return res.status(400).send({ success: false, message: "Please enter isDelete!" })
    }
    else if (allPermissionData[0].isDelete != "0" && allPermissionData[0].isDelete != "1") {
      return res.status(400).send({ success: false, message: "Please enter 0 & 1 only for isDelete!" })
    }

    if ((allPermissionData[0].isStatus).trim() == "") {
      return res.status(400).send({ success: false, message: "Please enter isStatus!" })
    }
    else if (allPermissionData[0].isStatus != "0" && allPermissionData[0].isStatus != "1") {
      return res.status(400).send({ success: false, message: "Please enter 0 & 1 only for isStatus!" })
    }

    const meuserData = await userPermissions.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (meuserData) {
      return res.status(400).send({ message: "User permissions already exists so please add a permission another user!" });
    }

    const permissiondata = await userPermissions.bulkCreate(allPermissionData)
    res.status(200).send({ message: "User permissions created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.updateUac = async (req, res) => {
  try {
    const userId = req.params.id;

    const checkuserper = await userPermissions.findOne({
      where: {
        userId: userId,
      },
    });
    if (!checkuserper) {
      return res.status(404).send({ message: "User Not found!" });
    }

    req.body.permissionsData.forEach(async (element) => {
      var moduleId = element.moduleId;

      const checkModuleId = await userPermissions.findOne({
        where: {
          moduleId: moduleId,
        },
      });

      if (!checkModuleId) {

        //Insert
        console.log(moduleId + "===Insert===" + userId);
        const permissionsData = await userPermissions.create({
          userId: userId,
          moduleId: moduleId,
          isAdd: element.isAdd,
          isUpdate: element.isUpdate,
          isRead: element.isRead,
          isDelete: element.isDelete,
          isStatus: element.isStatus,
        });
        //=====end====
      } else {
        //update
        console.log(moduleId + "===update===" + userId);
        const permissionsUpdate = await userPermissions.update({
          userId: userId,
          moduleId: moduleId,
          isAdd: element.isAdd,
          isUpdate: element.isUpdate,
          isRead: element.isRead,
          isDelete: element.isDelete,
          isStatus: element.isStatus,
        },
          { where: { moduleId: moduleId } }
        );
        //===End==
      }

    });
    res.status(200).send({ message: "User permissions updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.getAllUacList = async (req, res) => {

  try {

    let data = await userPermissions.findAll({});
    let response = {
      permissionsData: data
    }
    res.status(200).json(response);

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }

}