module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "Admin@#123456!",
  DB: "api_dev_jobreadynow",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
