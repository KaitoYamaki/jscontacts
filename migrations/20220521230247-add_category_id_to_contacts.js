'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Contacts',
      'categoryId',
      { 
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        },
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Contacts',
      'categoryId'
    );
  }
};
