module.exports = {
  HOST: "localhost",
  USER: "labuser",
  PASSWORD: "TW7y&VCzNWVvZqUC;",
  DB: "live_princetonhive_api",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
