module.exports=(sequelize, Sequelize, DataTypes)=>{
    const ContactUs=sequelize.define("hiv_contacts",{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          message: {
            type: DataTypes.STRING,
            allowNull: true,
          },
    })
    return ContactUs;
}