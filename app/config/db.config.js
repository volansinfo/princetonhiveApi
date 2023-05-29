module.exports = {
  HOST: "103.30.72.104",
  USER: "postgres",
  PASSWORD: "postgres",
  DB: "demoMylanTest",
  PORT:5444,

  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
