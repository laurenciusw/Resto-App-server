"use strict";

const { hashPassword } = require("../helpers/helper");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let dataUsers = require("../data.json").Users;
    dataUsers.forEach((el) => {
      delete el.id;
      el.password = hashPassword(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Users", dataUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", dataUsers);
  },
};
