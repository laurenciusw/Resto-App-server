'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  let dataCategories = require("../data.json").Categories
  dataCategories.forEach(el=>{
    delete el.id
    el.createdAt = new Date()
    el.updatedAt = new Date()
  })

  await queryInterface.bulkInsert("Categories",dataCategories)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories",dataCategories)
  }
};
