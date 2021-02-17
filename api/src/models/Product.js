const { DataTypes } = require('sequelize');
//const { is } = require('sequelize/types/lib/operators');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'product',
    {
      name: {
        // Marca + cepa + Año de cosecha. Unique: true;
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        validate: {
          //isNumeric: true,
          min: 0,
        },
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      yearHarvest: {
        type: DataTypes.INTEGER,
        validate: {
          len: [4], //revisar si necesita un solo valor o 2
        },
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        validate: {
          isURL: true,
        },
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
