const { Router } = require('express');

// import all routers;
const productRouter = require('./product.js');
const usersRouter = require('./users.js');
const ordersRouter = require('./orders.js');
const strainRouter = require('./strain.js');
const authRouter = require('./auth.js');
const searchRouter = require('./search.js');
const reviewRouter = require('./review.js');
const mailsRouter = require('./mails.js');
const mercadoPagoRouter = require ('./mercadoPago.js');

const router = Router();

// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);

//Rutas
router.use('/products', productRouter);
router.use('/strain', strainRouter);
router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/auth', authRouter);
router.use('/search', searchRouter);
router.use('/review', reviewRouter);
router.use('/mails', mailsRouter);
router.use('/mercadopago', mercadoPagoRouter);

module.exports = router;
