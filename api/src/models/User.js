const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { capitalize } = require('../utils');

module.exports = (sequelize) => {
  // defino el modelo
  const User = sequelize.define(
    'user',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validation: {
          isDate: true,
        },
      },
      cellphone: {
        type: DataTypes.BIGINT,
        validate: {
          isNumeric: true,
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      guest: {
        type: DataTypes.BOOLEAN,
        default: null,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          if (value) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
          }
        },
      },
    },

    {
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCreate(user) {
          user.firstName = capitalize(user.firstName);
          user.lastName = capitalize(user.lastName);
          let ageCheck = new Date();
          ageCheck.setFullYear(ageCheck.getFullYear() - 18);
          let bd = new Date(user.birthdate);
          if (ageCheck < bd) {
            throw new TypeError('Solo apto para mayores de edad');
          }
        },
      },
    }
  );
  User.prototype.compare = function (pass) {
    return bcrypt.compareSync(pass, this.password);
  };
  return User;
};
