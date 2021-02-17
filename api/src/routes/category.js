const server = require('express').Router();
const { Product, Category } = require('../db.js');
const { checkAdmin } = require('../utils/authTools.js');
const passport = require('passport');

//Devuelve todas las Categorías

server.get('/', (req, res, next) => {
  Category.findAll()
    .then((cat) => {
      res.send(cat);
    })
    .catch(next);
});

// Devuelve todas las categorias que tiene un producto

server.get('/product/:id', (req, res, next) => {
  let { id } = req.params;

  if (!id) return res.status(404).send('No existe el producto');

  Category.findAll({
    include: { model: Product, where: { id } },
  })
    .then((cats) => {
      res.json(
        cats.map((t) => {
          return { id: t.id, taste: t.taste };
        })
      );
    })
    .catch(next);
});

//Modificar Categoría

server.put(
  '/:id',
  (req, res) => {
    let { id } = req.params;
    if (!id) return res.status(400).send('La categoría no existe');

    Category.update({ taste }, { where: { id } }).then(() => {
      return res.status(200).send('Se ha modificado la categoría');
    });
  }
);

//Borrar Categoría del listado de Categorías (no de un solo producto)

server.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  (req, res) => {
    let { id } = req.params;

    if (!id) return res.status(400).send('No existe la categoría');

    Category.destroy({
      where: {
        id,
      },
    }).then((category) => {
      return res.status(200).send(category);
    });
  }
);

//Crear o modificar Categoría

server.post(
  '/',
  (req, res) => {
    let { taste } = req.body;
    if (!taste) return res.status(400).send('No se puede crear la categoría');

    Category.findOrCreate({
      where: {
        taste,
      },
      defaults: {
        taste,
      },
    }).then((category) => {
      return res.status(200).send(category);
    });
  }
);

module.exports = server;
