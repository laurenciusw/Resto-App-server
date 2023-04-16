"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cuisine.belongsTo(models.Category, { foreignKey: "categoryId" });
      Cuisine.belongsTo(models.User, { foreignKey: "authorId" });
    }
  }
  Cuisine.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Input the Cuisine Name`,
          },
          notEmpty: {
            msg: `Input the Cuisine Name`,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Input the Cuisine Description`,
          },
          notEmpty: {
            msg: `Input the Cuisine Description`,
          },
        },
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Price cannot be empty`,
          },
          notEmpty: {
            msg: `Price cannot be empty`,
          },
          customValidator(value) {
            if (value < 10000) {
              throw new Error("Minimum price is 10000");
            }
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Input the image link`,
          },
          notEmpty: {
            msg: `Input the image link`,
          },
        },
      },
      authorId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cuisine",
    }
  );
  return Cuisine;
};
