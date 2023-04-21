module.exports = (sequelize, Sequelize, DataTypes) => {
  const Category = sequelize.define("hiv_centralCategory", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: Sequelize.ENUM("0", "1"),
      defaultValue: "0",
      comment: "0-pending,1-active",
    },
  });

  return Category;
};
