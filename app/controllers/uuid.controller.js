const generateUUID = async () => {
    const uuid = await getLastUUID()
    let finalUuid = ''

    console.log(uuid)
    if (uuid) {
        let alpha_series = 'AB'
        let countryCode = 'IN'
        let stateCode = 'UP'
        let cityName = 'MUR'
        let reservNo = '4'
        let incrementer = '000000001'

        finalUuid = alpha_series + countryCode + stateCode + cityName + reservNo + incrementer
    } else {
        let alpha_series = uuid.slice(0, 2)
        let countryCode = uuid.slice(2, 4)
        let stateCode = uuid.slice(4, 6)
        let cityName = uuid.slice(6, 9)
        let reservNo = '4'

        let lastIdIncement = parseInt(uuid.slice(-9))

        let incrementer = await addLeadingZeros(lastIdIncement + 1).toString()

        finalUuid = alpha_series + countryCode + stateCode + cityName + reservNo + incrementer
    }
    console.log(finalUuid)

    return finalUuid
}

function getLastUUID() {
    // query to get last inserted id
    return 'null'
}

function addLeadingZeros(id) {
    if (id.length < 9) {
        let noneZeroEcode = Number(id).toString()
        let pad = '000000000'
        let uuid = pad.substring(0, pad.length - noneZeroEcode.length) + noneZeroEcode
        return uuid
    }
}

module.exports = generateUUID