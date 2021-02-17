const server = require('express').Router();
const { User, Order, Product, OrderLine, Review } = require('../db.js');
const { checkAdmin } = require('../utils/authTools.js');
const passport = require('passport');

//Borrar un USER by ID

server.delete(
  '/:id',
  // passport.authenticate('jwt', { session: false }),
  // checkAdmin,
  async (req, res) => {
    let { id } = req.params;
    if (!id) return res.status(400).send('No se recibio ID');
    const userToDestroy = await User.findByPk(id);
    if (!userToDestroy)
      return res.status(400).send('No existe el usuario a eliminar');
    const user = { ...userToDestroy.dataValues };
    const payload = {
      id: user.id,
      name: user.firstName + ' ' + user.lastName,
    };
    await userToDestroy.destroy();
    return res.status(200).send(payload);
  }
);

//Vaciar carrito

server.delete('/:userId/cart', async (req, res) => {
  let { userId } = req.params;
  if (!userId) return res.send(400, 'No hay carrito asociado al usuario');
  try {
    let cartFromUser = await Order.findOne({
      where: {
        status: 'cart',
        userId: userId,
      },
    });
    if (cartFromUser.dataValues && cartFromUser.dataValues.id) {
      let deletedOrderLines = await OrderLine.destroy({
        where: {
          orderId: cartFromUser.dataValues.id,
        },
      });
      return res.status(200).send(String(deletedOrderLines));
    } else {
      return res.status(400).send('el usuario no tiene carrito');
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Borrar producto del carrito

server.delete(
  '/:idUser/cart/:productId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let { idUser, productId } = req.params;
    let user = req.user;
    if (!idUser) return res.send(400, 'No hay carrito asociado al usuario');
    console.log('recibimos', user, idUser, productId);
    // Condición de entrada para admin
    if (user.isAdmin) {
      Order.findOne({
        where: {
          status: 'pending',
          userId: idUser,
        },
      })
        .then((orders) => {
          let id = orders.id;
          OrderLine.destroy({
            where: {
              orderId: id,
              productId,
            },
          }).then(() => {
            return res
              .status(200)
              .send('El producto ha sido eliminado del carrito');
          });
        })
        .catch((err) => {
          return res.status(500);
        });
    } else {
      // Condición de entrada para cualquier user
      Order.findOne({
        where: {
          status: 'cart',
          userId: idUser,
        },
      })
        .then((orders) => {
          let id = orders.id;
          OrderLine.destroy({
            where: {
              orderId: id,
              productId,
            },
          }).then(() => {
            return res
              .status(200)
              .send('El producto ha sido eliminado del carrito');
          });
        })
        .catch((err) => {
          return res.status(500);
        });
    }
  }
);

// Listar todos los USERS

server.get(
  '/',
  /*passport.authenticate('jwt', { session: false }),
  checkAdmin,*/
  (req, res, next) => {
    User.findAll()
      .then((user) => {
        return res.status(200).send(user);
      })
      .catch(next);
  }
);

// Ruta que retorna todos los items del carrito - GET a /users/:id/cart

server.get('/:id/cart', (req, res) => {
  let { id } = req.params;
  Order.findAll({
    where: { status: 'cart', userId: id },
    include: { model: OrderLine, include: [{ model: Product }] },
  }).then((ord) => {
    return res.status(200).send(ord);
  });
});

// Ruta que retorna todas las ordenes de un usuario

server.get('/:id/orders', (req, res) => {
  let { id } = req.params;
  id = id * 1;
  Order.findAll({
    where: { userId: id },
    include: {
      model: OrderLine,
      include: [{ model: Product, include: [{ model: Review }] }],
    },
  })
    .then((list) => {
      res.json(list);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Agregar elemento al carrito

server.post('/:userId/cart', async (req, res) => {
  let { userId } = req.params;
  let { id, price, quantity, increment, cartGuest } = req.body;

  if (!id || !userId)
    return res.status(400).send('Id de usuario o producto faltante');
  try {
    const [newOrder, newOrderCreated] = await Order.findOrCreate({
      where: {
        userId,
        status: 'cart',
      },
      defaults: {
        total: 0,
      },
    });
    const [newOrderLine, newOrderLineCreated] = await OrderLine.findOrCreate({
      where: {
        productId: id,
        orderId: newOrder.dataValues.id,
      },
      defaults: {
        productId: id,
        quantity: 1,
        price,
        orderId: newOrder.dataValues.id,
      },
    });

    if (!newOrderLineCreated) {
      await newOrderLine.update(
        {
          quantity:
            !cartGuest && increment
              ? newOrderLine.dataValues.quantity + 1
              : !cartGuest && !increment
              ? newOrderLine.dataValues.quantity - 1
              : quantity,
        },
        { where: { productId: id, orderId: newOrder.dataValues.id } }
      );
    }

    return res.status(200).send({ newOrder, newOrderLine });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//Editar un USER by ID

server.put('/:id', async (req, res) => {
  let { id } = req.params;
  let {
    firstName,
    lastName,
    email,
    birthdate,
    cellphone,
    isAdmin,
    password,
  } = req.body;

  if (!id) return res.status(400).send('El usuario no existe');

  const userToEdit = await User.findByPk(id);

  const userEdited = await userToEdit.update(
    { firstName, lastName, email, birthdate, cellphone, isAdmin, password },
    { where: { id } }
  );

  return res.status(200).json(userEdited);
});

//Editar cantidades de producto

server.put('/:idUser/cart', (req, res) => {
  let { idUser } = req.params;
  idUser = idUser * 1;
  let { productId, quantity } = req.body;

  if (!idUser) return res.status(400).send('El usuario no existe');

  Order.findOne({
    where: {
      status: 'cart',
      userId: idUser,
    },
  })
    .then((orders) => {
      let id = orders.id;
      OrderLine.update(
        { quantity },
        { where: { productId: productId, orderId: id } }
      );
    })
    .then(() => {
      return res.send(200, 'El carrito del usuario se ha actualizado');
    });
});

module.exports = server;
