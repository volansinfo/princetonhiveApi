const db = require("../models");
const config = require("../config/auth.config");
const Widget = db.WidgetPage;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.widgetAdd = async (req, res) => {
    try {
        const widget = await Widget.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        });
        res.status(200).send({ success: true, message: "widget add successfully:" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

exports.getAllWidgets = async (req, res) => {
    try {
        let data = await Widget.findAll();
        let response = {
            widgetData: data
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
            return res.status(404).send({ success:false, message: "Widget Not found!" });
        }
        const widget = await Widget.update({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        },
            { where: { id: widgetId } }
        );
        return res.status(200).send({ success:true, message: 'Widget data updated successfully!' });
    } catch (error) {
        return res.status(500).send({ success:false, message: error.message });
    }
};

exports.widgetstatus = async (req, res) => {
    try {
        const widgetId = req.params.id;
        const widgetStatus = req.body.status;
        if (widgetStatus == 1) {
            const result = await Widget.update(
                { status: widgetStatus },
                { where: { id: widgetId } }
            )
            res.status(200).send({ success:true, message: "widget has been active!" });
        } else {
            const result = await Widget.update(
                { status: widgetStatus },
                { where: { id: widgetId } }
            )
            res.status(200).send({ success:true, message: "Widget has bee deactivate!" });
        }

    } catch (eror) {
        return res.status(500).send({ success:false, message: error.message });
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
            return res.status(404).send({ success:false, message: "Widget Not found!" });
        }
        const widgetdelete = await Widget.destroy({
            where: {
                id: widgetId,
            }

        })

        res.status(200).send({ success:true, message: "Widget was deleted successfully!" });
    } catch (error) {
        return res.status(500).send({ success:false, message: error.message });
    }
}