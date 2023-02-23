const db = require("../models")
const globalConfig = db.globalConfig

exports.addServerDetails = async (req, res) => {
    try {

        const config = await globalConfig.create({
            hostName: req.body.hostName,
            portNumber: req.body.portNumber,
            authUser: req.body.authUser,
            authPassword: req.body.authPassword,
            hostType: req.body.hostType
        });

        res.status(200).send({ success: true, message: "Server configuration details added successfully." })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}

exports.getServerDetails = async (req, res) => {
    try {

        const serverDetails = await globalConfig.findAll()

        res.status(200).send({ success: true, serverDetails })
    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}

exports.deleteServerDetails = async (req, res) => {
    try {
        const server = await globalConfig.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!server) {
            return res.status(404).send({ success: false, message: "Server details not found!" })
        }

        await globalConfig.destroy({
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({ success: true, message: "Server details deleted successfully" })

    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}

exports.updateServerStatus = async (req, res) => {
    try {

        const server = await globalConfig.findOne({
            where: {
                id: req.body.id
            }
        })

        if (!server) {
            return res.status(404).send({ success: false, message: "Server details not found!" })
        }

        await globalConfig.update({
            status: req.body.status
        }, {
            where: {
                id: req.body.id
            }
        })

        res.status(200).send({ success: true, message: "Status updatetd successfully." })

    } catch (e) {
        res.status(500).send({ success: false, message: e.message })
    }
}

exports.updateServerDetails = async (req,res) => {
    try{
    const server = await globalConfig.findOne({
        where: {
            id: req.query.serverId
        }
    })

    if (!server) {
        return res.status(404).send({ success: false, message: "Server details not found!" })
    }

    const config = await globalConfig.update({
        hostName: req.body.hostName,
        portNumber: req.body.portNumber,
        authUser: req.body.authUser,
        authPassword: req.body.authPassword,
        hostType: req.body.hostType
    },{
        where:{
            id:req.query.serverId
        }
    });

    res.status(200).send({ success: true, message: "Server details updated successfully." })
}catch(e){
    res.status(500).send({success:false,message:e.message})
}

}