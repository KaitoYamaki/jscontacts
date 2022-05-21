'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Contact = thisu.hasMany(modeles.Contact, {
        foreingKey: 'categoryId',
        as: 'cotnacts'
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [0, 20],
      }
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};