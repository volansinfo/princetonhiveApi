const db = require("../models")
const Role = db.role

exports.addRole = async (req, res) => {
    try {

        const role = await Role.create({
            id: req.body.id,
            name: req.body.name,
            status: req.body.status
        });
        res.status(200).send({ message: "Role added successfully." })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.getAllRoles = async (req, res) => {
    try {
        const data = await Role.findAll()
        const response ={
            roles:data
        }

        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.deleteRole = async(req,res)=>{
    try{

        const roleId=req.params.id;

        const role = await Role.findOne({
            where:{
                id:roleId
            }
        });
        if(!role){
            return req.status(404).send({message:"User role doesn't exist."})
        }

        const roleDelete = await Role.destroy({
            where:{
                id:role
            }
        })
        res.status(200).send({message:"User role deleted"})
    }catch(error){
        res.status(500).send({message:error.message})
    }
}