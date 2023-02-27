const db = require("../models");
const Page = db.StateCountry;


exports.getStateCountry = async (req, res) => {
    try {
        let data = await Page.findAll();
        res.status(200).send({ success: true, statecountryData: data });
        if (!data) {
            return res.status(404).send({ success: false, message: "data Not found!" });
        }

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
exports.addStateCountry = async (req, res) => {
    try {
        let stateName = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
            "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
            "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
            "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

        let stateCode = ["AN", "AP", "AR", "AS", "BR", "CG", "CH", "DN", "DD", "DL", "GA", "GJ", "HR", "HP", "JK", "JH", "KA", "KL", "LA", "LD", "MP",
            "MH", "MN", "ML", "MZ", "NL", "OR", "PY", "PB", "RJ", "SK", "TN", "TS", "TR", "UP", "UK", "WB"]
        for (let i = 0; i < stateName.length; i++) {
            // user = await User.findOne({
            //     where: {
            //         email: req.body.email
            //     }
            // });

            if (stateName[i]) {
                return res.status(400).send({success:false,
                    message: "Failed! this data is already added!"
                });
            }
            const page = await Page.create({
                statename: stateName[i],
                statecode: stateCode[i],
                countryname: "India",
                countrycode: "IN",
            });
        }
        res.status(200).send({ success: true, message: "statecountry add successfully:" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

