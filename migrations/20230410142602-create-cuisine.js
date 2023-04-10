'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cuisines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      imgUrl: {
        type: Sequelize.STRING
      },
      authorId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:"Users",
          key:"id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      categoryId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:"Categories",
          key:"id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cuisines');
  }
};