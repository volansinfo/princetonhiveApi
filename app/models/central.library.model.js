module.exports = (sequelize, Sequelize, DataTypes) => {
  const Library = sequelize.define("hiv_central_library", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bookUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fileUpload: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("0", "1"),
      defaultValue: "0",
      comment: "0-pending,1-active",
    },
  });

  return Library;
};
