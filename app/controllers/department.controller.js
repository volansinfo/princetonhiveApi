const db = require("../models");
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination");
const department = db.Department;

exports.departmentAdd = async (req, res) => {
  try {
    const isValidRequestBody = function (requestBody) {
      return Object.keys(requestBody).length > 0;
    };
    if (!isValidRequestBody(req.body)) {
      return res.status(400).send({ status: false, msg: "Please enter data" });
    }
    if (req.body?.departmentName == "" || !req.body.departmentName) {
      return res.status(400).send({ message: "Please enter department name!" });
    }
    const existdepartment = await department.findOne({
      where: {
        departmentName: req.body?.departmentName,
      },
    });

    if (existdepartment) {
      return res
        .status(400)
        .send({ success: false, message: "Department already exist!" });
    }

    if (req.body?.status == "") {
      return res
        .status(400)
        .send({ message: "Status value should not empty!" });
    } else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res
        .status(400)
        .send({ message: "Status value should be 0 & 1 only!" });
    }
    const result = await department.create({
      departmentName: req.body.departmentName,
      status: req.body.status,
    });

    res
      .status(200)
      .send({ success: true, message: "Department added successfully!" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const { limit, offset } = pagination.getPagination(req.query.page, 10);

    const allDepartment = await department.findAndCountAll({
      limit,
      offset,
      where: {
        status: "1",
      },
      order: [["id", "DESC"]],
    });
    const response = pagination.getPaginationData(
      allDepartment,
      req.query.page,
      limit
    );
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const Data = await department.findOne({
      where: {
        id: departmentId,
      },
    });
    if (!Data) {
      return res
        .status(404)
        .send({ success: false, message: "Department Not found!" });
    }
    let response = {
      departmentData: Data,
    };
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.departmentstatus = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const departmentStatus = req.body.status;
    const data = await department.findOne({
      where: {
        id: departmentId,
      },
    });
    if (!data) {
      return res.status(404).send({ message: "Department Not found!" });
    }
    if (req.body.status.trim() == "") {
      return res
        .status(400)
        .send({ message: "Status value should not empty!" });
    } else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res
        .status(400)
        .send({ message: "Status value should be 0 & 1 only!" });
    }

    if (departmentStatus == 1) {
      const result = await department.update(
        { status: departmentStatus },
        { where: { id: departmentId } }
      );
      res
        .status(200)
        .send({ success: true, message: "Department has been enabled!" });
    } else {
      const result = await department.update(
        { status: departmentStatus },
        { where: { id: departmentId } }
      );
      res
        .status(200)
        .send({ success: true, message: "Department has been disabled!" });
    }
  } catch (eror) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
// departmentDelete
exports.departmentDelete = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const data = await department.findOne({
      where: {
        id: departmentId,
      },
    });
    if (!data) {
      return res
        .status(404)
        .send({ success: false, message: "Department Not found!" });
    }
    const departmentdelete = await department.destroy({
      where: {
        id: departmentId,
      },
    });

    res
      .status(200)
      .send({ success: true, message: "Department deleted successfully!" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const departmentData = await department.findOne({
      where: {
        id: departmentId,
      },
    });
    if (!departmentData) {
      return res
        .status(404)
        .send({ success: false, message: "Department Not found!" });
    }

    const allDepartmentData = await department.findAll();

    if (req.body.status.trim() == "") {
      return res
        .status(400)
        .send({ message: "Status value should not empty!" });
    } else if (!(req.body.status == 0) && !(req.body.status == 1)) {
      return res
        .status(400)
        .send({ message: "Status value should be 0 & 1 only!" });
    }
    const result = await department.update(
      {
        departmentName: req.body.departmentName,
        status: req.body.status,
      },
      { where: { id: departmentId } }
    );
    return res.status(200).send({
      success: true,
      message: "Department data updated successfully!",
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
