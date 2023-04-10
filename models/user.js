'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Cuisine, {foreignKey : "authorId"})

    }
  }
  User.init({
    username: {
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
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        isEmail:{
          msg:`Email harus berupa fornat email`
        },
        notNull:{
          msg:`Email harus diisi`
        },
        notEmpty:{
          msg:`Email harus diisi`
        }
      }
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:`Password harus diisi`
        },
        notEmpty:{
          msg:`Password harus diisi`
        },
        customValidator(value) {
          if (value.length <5 ) {
            throw new Error("Password minimal 5 karakter");
          }
        }
      }
    },
    role: {
      type:DataTypes.STRING,
      defaultValue: 'admin'
    },
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};