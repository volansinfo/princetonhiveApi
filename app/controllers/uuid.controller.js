const db = require("../models");
const User = db.user;
let stuMaxUUID = [];
let admMaxUUID = [];
let uniMaxUUID = [];
let tecMaxUUID = [];
let supMaxUUID = [];
let allUUID = [];

const generateUUID = async (req) => {
  let uuid = await getLastUUID(req.body);

  return uuid;
};

async function getLastUUID(reqBody) {
  const user = await User.findAll();

  for (let i = 0; i < user.length; i++) {
    allUUID.push(user[i].uuid);
  }

  for (let i = 0; i < allUUID.length; i++) {
    let userType = allUUID[i].slice(0, 3);

    switch (userType) {
      case "ADM":
        admMaxUUID.push(allUUID[i]);
        break;
      case "UNI":
        uniMaxUUID.push(allUUID[i]);
        break;
      case "TEA":
        tecMaxUUID.push(allUUID[i]);
        break;
      case "STU":
        stuMaxUUID.push(allUUID[i]);
        break;
      case "SUP":
        supMaxUUID.push(allUUID[i]);
        break;
    }
  }

  let lastUUID = "";

  switch (reqBody.roles[0]) {
    case "admin":
      lastUUID = getAdminUUId(reqBody);
      break;
    case "university":
      lastUUID = getUniversityUUID(reqBody);
      break;
    case "teacher":
      lastUUID = getTeacherUUID(reqBody);
      break;
    case "student":
      lastUUID = getStudentUUID(reqBody);
      break;
    case "support":
      lastUUID = getSupportUUID(reqBody);
      break;
  }

  return lastUUID;
}

/**
 * generate admin UUID
 */
function getAdminUUId(reqBody) {
  let lastUUID;
  if (admMaxUUID.length == 0) {
    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = "000001";

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  } else {
    let maxUUID = [];
    for (let i = 0; i < admMaxUUID.length; i++) {
      maxUUID.push(parseInt(admMaxUUID[i].slice(-6)));
    }

    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = addLeadingZeros(Math.max(...maxUUID) + 1, "Admin");

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  }

  return lastUUID;
}

/**
 * generate university UUID
 */
function getUniversityUUID(reqBody) {
  let lastUUID;
  if (uniMaxUUID.length == 0) {
    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let orgCode = reqBody.fname.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = "000001";

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      orgCode +
      reservNo +
      incrementer;
  } else {
    let maxUUID = [];
    for (let i = 0; i < uniMaxUUID.length; i++) {
      maxUUID.push(parseInt(uniMaxUUID[i].slice(-6)));
    }

    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = addLeadingZeros(Math.max(...maxUUID) + 1, "University");

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  }

  return lastUUID;
}

/**
 *  generate student UUID
 */
function getStudentUUID(reqBody) {
  let lastUUID;
  if (stuMaxUUID.length == 0) {
    let alpha_series = getUserTypes("student");
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = "000000001";

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  } else {
    let maxUUID = [];
    for (let i = 0; i < stuMaxUUID.length; i++) {
      maxUUID.push(parseInt(stuMaxUUID[i].slice(-9)));
    }

    let alpha_series = getUserTypes("student");
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = addLeadingZeros(Math.max(...maxUUID) + 1, "Student");

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  }

  return lastUUID;
}

/**
 * generate teacher UUID
 */
function getTeacherUUID(reqBody) {
  let lastUUID;
  if (tecMaxUUID.length == 0) {
    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = "000000001";

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  } else {
    let maxUUID = [];
    for (let i = 0; i < tecMaxUUID.length; i++) {
      maxUUID.push(parseInt(tecMaxUUID[i].slice(-9)));
    }

    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = addLeadingZeros(Math.max(...maxUUID) + 1, "Teacher");

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  }

  return lastUUID;
}

/**
 *
 * generate support UUID
 */

function getSupportUUID(reqBody) {
  let lastUUID;
  if (supMaxUUID.length == 0) {
    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = "000001";

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  } else {
    let maxUUID = [];
    for (let i = 0; i < supMaxUUID.length; i++) {
      maxUUID.push(parseInt(supMaxUUID[i].slice(-6)));
    }

    let alpha_series = getUserTypes(reqBody.roles[0]);
    let countryCode = reqBody.country.toUpperCase();
    let stateCode = reqBody.state.toUpperCase();
    let cityName = reqBody.city.slice(0, 3).toUpperCase();
    let reservNo = "4";
    let incrementer = addLeadingZeros(Math.max(...maxUUID) + 1, "Support");

    lastUUID =
      alpha_series +
      countryCode +
      stateCode +
      cityName +
      reservNo +
      incrementer;
  }
  return lastUUID;
}

function getUserTypes(userType) {
  let user;
  switch (userType) {
    case "admin":
      user = "ADM";
      break;
    case "university":
      user = "UNI";
      break;
    case "teacher":
      user = "TEA";
      break;
    case "student":
      user = "STU";
      break;
    case "support":
      user = "SUP";
      break;
  }
  return user;
}

function addLeadingZeros(id, type) {
  let noneZeroEcode = Number(id).toString();
  let pad = getPadsZero(type);
  let uuid =
    pad.substring(0, pad.length - noneZeroEcode.length) + noneZeroEcode;
  return uuid;
}

function getPadsZero(type) {
  let padZero;

  switch (type) {
    case "Support":
    case "University":
    case "Admin":
      padZero = "000000";
      break;
    case "Student":
    case "Teacher":
      padZero = "000000000";
      break;
  }

  return padZero;
}

// // only generating uuid for student in csv file data
// const generateUuidStudent = async (countryAndstate) => {
//   console.log(countryAndstate.length, "cccsss");
//   const res = await User.findAll();
//   const uuidData = [];
//   const tea = [];
//   for (let i = 0; i < res.length; i++) {
//     const uuids = res[i].uuid;
//     uuidData.push(uuids);
//     // console.log(res[i].uuid);
//   }
//   for (let i = 0; i < uuidData.length; i++) {
//     const b = uuidData[i].slice(0, 3);
//     if (b == "STU") {
//       tea.push(b);
//     }
//   }

//   const total = tea.length;
//   //   console.log(total);
//   if (total == 0) {
//     const val = 400000000 + 1;

//     // console.log("STU" + countryAndstate.toUpperCase() + val);
//     // const toUpperCountyandAtate = countryAndstate.toUpperCase();
//     // console.log("STU" + country + state + val);
//     return "STU" + toUpperCountyandAtate + val;
//   } else {
//     const mxVal = 400000000 + total;
//     // const toUpperCountyandAtate = countryAndstate.toUpperCase();
//     console.log("STU" + toUpperCountyandAtate + mxVal);
//     return "STU" + toUpperCountyandAtate + mxVal;
//   }
// };

function addLeadZeros(id, type) {
  let noneZeroEcode = Number(id).toString();
  let pad = "000000000";
  let uuid =
    pad.substring(0, pad.length - noneZeroEcode.length) + noneZeroEcode;
  return uuid;
}

const generateStudentuuid = async (row) => {
  const user = await User.findAll();
  // console.log(user.length, "User length");
  if (user.length != 0) {
    for (let i = 0; i < user.length; i++) {
      allUUID.push(user[i].uuid);
    }

    for (let i = 0; i < allUUID.length; i++) {
      let userType = allUUID[i].slice(0, 3);

      if (userType == "STU") {
        stuMaxUUID.push(allUUID[i]);
      }
    }
    console.log(allUUID.length, "All User length");
    console.log(stuMaxUUID.length, "All Stu length");
  }
  let lastUUID = getStudentUUID(row);

  return lastUUID;
};

module.exports = generateUUID;
module.exports = generateStudentuuid;
// module.exports = generateUuidStudent;
