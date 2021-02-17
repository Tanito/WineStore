const server = require('express').Router();
const { extractDigitsFromString } = require('../utils/index.js');
const { Product } = require('../db.js');
const { Sequelize, Op } = require('sequelize');

server.get('/', (req, res) => {
  let { word } = req.query;
  let search = extractDigitsFromString(word); //func para extraer numeros de string de busqueda
  let conditions = [];
  //* Si `search.words` pusheamos al array de condiciones de busqueda (name & description)
  if (search.words && search.words.length > 0) {
    for (const word of search.words) {
      conditions.push(
        { name: { [Op.iLike]: '%' + word + '%' } },
        { description: { [Op.iLike]: '%' + word + '%' } }
      );
    }
  }
  //* Si `search.digits` pusheamos al array de condiciones de busqueda (yearHarvest)
  if (search.digits && search.digits.length > 0) {
    for (const number of search.digits) {
      conditions.push({ yearHarvest: { [Op.eq]: number } });
    }
  }
  Product.findAll({
    where: {
      [Op.or]: conditions,
    },
  })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => console.error(err));
});

module.exports = server;
