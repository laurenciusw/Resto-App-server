"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bookmark.belongsTo(models.User, { foreignKey: "userId" });
      Bookmark.belongsTo(models.Cuisine, { foreignKey: "cuisineId" });
    }
  }
  Bookmark.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `userId is required`,
          },
          notEmpty: {
            msg: `userId is required`,
          },
        },
      },
      cuisineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `cuisineId is required`,
          },
          notEmpty: {
            msg: `cuisineId is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Bookmark",
    }
  );
  return Bookmark;
};
