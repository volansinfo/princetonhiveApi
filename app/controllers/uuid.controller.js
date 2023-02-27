const db = require("../models");
const User = db.user

const generateUUID = async (req) => {
    let uuid = await getLastUUID(req.body)

    return uuid
}

async function getLastUUID(reqBody) {
    const user = await User.findAll()

    let lastUUID = ''

    if (user.length == 0) {
        let alpha_series = "STU"
        let countryCode = reqBody.country.toUpperCase()
        let stateCode = reqBody.state.toUpperCase()
        let cityName = reqBody.city.slice(0, 3).toUpperCase()
        let reservNo = '4'
        let incrementer = '000000001'

        lastUUID = alpha_series + countryCode + stateCode + cityName + reservNo + incrementer;

    } else {
        let maxUUID = []
        for (let i = 0; i < user.length; i++) {
            maxUUID.push(parseInt(user[i].uuid.slice(-9)))
        }

        let alpha_series = "STU"
        let countryCode = reqBody.country.toUpperCase()
        let stateCode = reqBody.state.toUpperCase()
        let cityName = reqBody.city.slice(0, 3).toUpperCase()
        let reservNo = '4'
        let incrementer = addLeadingZeros(Math.max(...maxUUID) + 1)

        lastUUID = alpha_series + countryCode + stateCode + cityName + reservNo + incrementer;

    }

    console.log(lastUUID)
    return lastUUID
}

function addLeadingZeros(id) {
    let noneZeroEcode = Number(id).toString()
    let pad = '000000000'
    let uuid = pad.substring(0, pad.length - noneZeroEcode.length) + noneZeroEcode
    return uuid
}

module.exports = generateUUID