const server = require('express').Router();
const { Order, OrderLine } = require('../db.js');

//El Carrito va a ser una orden con un status CART

//Obtener la orden CARRITO (CART)

server.post('/', (req, res) => {
  let { id } = req.params;
  let { productId, quantity, price } = req.body;

  if (!productId || !id)
    return res.status(400).send('No se puede agregar el producto al carrito');

  Order.findAll({
    where: { userId: id, status: 'cart' },
  }).then((order) => {
    OrderLine.findOrCreate({
      where: {
        productId: id,
      },
      defaults: {
        productId,
        quantity,
        price,
        orderId: order.id,
      },
    }).then((result) => {
      const [instance, wasCreated] = result;
    });
  });
  res.status(200).send('Entré a agregar item al carrito');
});

module.exports = server;
