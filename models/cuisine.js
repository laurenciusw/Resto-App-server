'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cuisine.belongsTo(models.Category, {foreignKey :"categoryId"})
      Cuisine.belongsTo(models.User, {foreignKey :"authorId"})
    }
  }
  Cuisine.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:`Nama harus diisi`
        },
        notEmpty:{
          msg:`Nama harus diisi`
        },
      }
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:`description harus diisi`
        },
        notEmpty:{
          msg:`description harus diisi`
        },
      }
    },
    price: DataTypes.INTEGER,
    imgUrl:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:`imgUrl harus diisi`
        },
        notEmpty:{
          msg:`imgUrl harus diisi`
        },
      }
    },
    authorId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cuisine',
  });
  return Cuisine;
};