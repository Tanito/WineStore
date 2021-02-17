const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('review', {
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description:{
      type: DataTypes.TEXT,
    },
  });
};
