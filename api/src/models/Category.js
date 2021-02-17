const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'category',
    {
      taste: {
        // Sabores (tipo dulce, frutal, ácido, bla bla bla)
        type: DataTypes.STRING, //La validación la hacemos en el front??
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
