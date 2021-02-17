const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('refreshTokens', {
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IAT: { type: DataTypes.DATE, allowNull: false },
    EAT: { type: DataTypes.DATE, allowNull: false },
  });
};
