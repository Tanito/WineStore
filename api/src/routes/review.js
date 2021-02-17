const server = require('express').Router();
const { Product, Review, User } = require('../db.js');

//Crea una Review para un producto. Faltaría agregar al usuario, pero aún no tenemos login.

server.post('/:idProduct/', (req, res) => {
  let { idProduct } = req.params;
  let { points, description, userId } = req.body;

  if (!idProduct || !points || !userId)
    return res.status(400).send('No se puede agregar la Review');
  User.findByPk(userId).then(() => {
    Review.create({
      points,
      description,
    }).then((rev) => {
      Product.findByPk(idProduct).then((product) => {
        product.addReview(rev);
        rev.setUser(userId);
        return res.send('Se agregó la Review');
      });
    });
  });
});

//Editar una Review

server.put('/:id', (req, res) => {
  let { points, description } = req.body;
  let { id } = req.params;

  if (!id) return res.status(400).send('La Review no se encuentra');
  Review.update({ points, description }, { where: { id } }).then(() => {
    return res.status(200).send('Se ha modificado la categoría');
  });
});

//Borrar una Review

server.delete('/:id', (req, res) => {
  let { id } = req.params;
  if (!id) return res.status(400).send('No existe la Review');

  Review.destroy({
    where: {
      id,
    },
  }).then(() => {
    return res.send(200, `Review ${id} borrada`);
  });
});

//Ver todas las Reviews de un Producto

server.get('/:productId', (req, res, next) => {
  let { productId } = req.params;
  if (!productId)
    return res.status(404).send('No existen reviews para ese producto');

  Review.findAll({
    where: {
      productId,
    },
    include: [
      {
        model: User,
        paranoid: false,
      },
    ],
  })
    .then((revs) => {
      res.json(
        revs.map((r) => {
          return {
            id: r.id,
            points: r.points,
            description: r.description,
            productId,
            createdAt: r.createdAt,
            firstName: r.user.firstName,
            lastName: r.user.lastName,
          };
        })
      );
    })
    .catch(next);
});

//Ver todas las Reviews de un Usuario

server.get('/user/:userId', (req, res, next) => {
  let { userId } = req.params;
  if (!userId) return res.status(404).send('No existen reviews de ese usuario');

  Review.findAll({
    where: {
      userId,
    },
    /*     include: { model: User, where: { id: userId } }, */
  })
    .then((revs) => {
      res.json(
        revs.map((r) => {
          return {
            id: r.id,
            points: r.points,
            description: r.description,
            productId: r.productId,
          };
        })
      );
    })
    .catch(next);
});

module.exports = server;
