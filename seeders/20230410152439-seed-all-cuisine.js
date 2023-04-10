'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let dataCuisines = require("../data.json").Cuisines
    dataCuisines.forEach(el=>{
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
  
    await queryInterface.bulkInsert("Cuisines",dataCuisines)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Cuisines",dataCuisines)
  }
};
