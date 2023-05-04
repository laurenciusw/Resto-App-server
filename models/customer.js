"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: `Email must be in email format`,
          },
          notNull: {
            msg: `Email cannot be empty`,
          },
          notEmpty: {
            msg: `Email cannot be empty`,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [5],
            msg: `password min 5 character`,
          },
          notNull: {
            msg: `Input the password!`,
          },
          notEmpty: {
            msg: `Input the password!`,
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "customer",
      },
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
