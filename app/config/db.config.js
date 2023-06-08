module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "Admin@#123456!",
  DB: "mylanguage_api_live",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
