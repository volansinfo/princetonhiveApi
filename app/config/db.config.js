module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PORT:5444,
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
