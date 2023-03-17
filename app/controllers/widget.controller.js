const db = require("../models");
const config = require("../config/auth.config");
const pagination = require("../middleware/pagination")
const Widget = db.WidgetPage;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.widgetAdd = async (req, res) => {
    try {
        if ((req.body.title).trim() == "") {
            return res.status(400).send({ message: "Please enter title!" })
        }
        if ((req.body.status).trim() == "") {
            return res.status(400).send({ message: "Status value should not empty!" })
        }
        else if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Status value should be 0 & 1 only!" })
        }
        const widget = await Widget.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        });

        res.status(200).send({ success: true, message: "Widget added successfully!" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

exports.getAllWidgets = async (req, res) => {
    try {
        const { limit, offset } = pagination.getPagination(req.query.page, 10)

        const allWidget = await Widget.findAndCountAll({
            limit,
            offset,
            order: [
                ['id', 'DESC']
            ]
        })
        const response = pagination.getPaginationData(allWidget, req.query.page, limit)
        res.status(200).json({ success: true, data: response });

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }

};
exports.getWidget = async (req, res) => {
    try {
        const widgetId = req.params.id;
        const widgetData = await Widget.findOne({
            where: {
                id: widgetId,
            },
        });
        if (!widgetData) {
            return res.status(404).send({ success: false, message: "Widget Not found!" });
        }
        let response = {
            widgetData: widgetData
        }
        res.status(200).json(response);

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }

};


exports.updateWidget = async (req, res) => {
    try {
        const widgetId = req.params.id;
        const widgetData = await Widget.findOne({
            where: {
                id: widgetId,
            },
        });
        if (!widgetData) {
            return res.status(404).send({ success: false, message: "Widget Not found!" });
        }
        if ((req.body.title).trim() == "") {
            return res.status(400).send({ message: "Please enter title!" })
        }
        if ((req.body.status).trim() == "") {
            return res.status(400).send({ message: "Status value should not empty!" })
        }
        else if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Status value should be 0 & 1 only!" })
        }
        const widget = await Widget.update({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        },
            { where: { id: widgetId } }
        );
        return res.status(200).send({ success: true, message: 'Widget data updated successfully!' });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

exports.widgetstatus = async (req, res) => {
    try {
        const widgetId = req.params.id;
        const widgetStatus = req.body.status;
        const widget = await Widget.findOne({
            where: {
                id: widgetId,
            },
        });
        if (!(widget)) {
            return res.status(404).send({ message: "Widget Not found!" })
        }
        if ((req.body.status).trim() == "") {
            return res.status(400).send({ message: "Status value should not empty!" })
        }
        else if (!(req.body.status == 0) && !(req.body.status == 1)) {
            return res.status(400).send({ message: "Status value should be 0 & 1 only!" })
        }

        if (widgetStatus == 1) {
            const result = await Widget.update(
                { status: widgetStatus },
                { where: { id: widgetId } }
            )
            res.status(200).send({ success: true, message: "Widget has been active!" });
        } else {
            const result = await Widget.update(
                { status: widgetStatus },
                { where: { id: widgetId } }
            )
            res.status(200).send({ success: true, message: "Widget has bee deactivate!" });
        }

    } catch (eror) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

exports.widgetDelete = async (req, res) => {
    try {
        const widgetId = req.params.id;
        const widget = await Widget.findOne({
            where: {
                id: widgetId,
            },
        });
        if (!widget) {
            return res.status(404).send({ success: false, message: "Widget Not found!" });
        }
        const widgetdelete = await Widget.destroy({
            where: {
                id: widgetId,
            }

        })

        res.status(200).send({ success: true, message: "Widget was deleted successfully!" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
}