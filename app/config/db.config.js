module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "postgres",
  DB: "demoMylanTest",

  dialect: "postgres",
  pool: {
    port:5444,
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
