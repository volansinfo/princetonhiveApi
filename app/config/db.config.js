module.exports = {
  HOST: "127.0.0.1:5444",
  USER: "postgres",
  PASSWORD: "postgres",
  DB: "demoMylanTest",

  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
