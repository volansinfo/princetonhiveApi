let convertStartDate = new Date("2023-04-07T04:43:00.679Z");

let convertStartDateEpoch = convertStartDate.getTime() / 1000.0;
const a = new Date(convertStartDateEpoch * 1000);
let actual = a.toGMTString();
console.log(convertStartDateEpoch, actual);
