const server = require('express').Router();
const { Sequelize } = require('sequelize');
const { Product, Category } = require('../db.js');
const categoryRouter = require('./category.js');
const { checkAdmin } = require('../utils/authTools.js');
const passport = require('passport');

server.use('/category', categoryRouter);

//Listado de todos los Productos

server.get('/', (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.send(products);
    })
    .catch(next);
});

//Devuelve un producto según el ID

server.get('/:id', (req, res) => {
  let { id } = req.params;
  if (!id) return res.status(404).send('No existe el producto');
  Product.findByPk(id).then((product) => {
    return res.status(200).send(product);
  });
});

//Filtrar productos por categoría

server.get('/productsByCategory/:category', (req, res) => {
  let { category } = req.params;
  if (!category) return res.status(404).send('Se necesita categoría');
  Category.findAll({
    where: { taste: category },
    include: { model: Product },
  }).then((s) => {
    res.json(s);
  });
});

//Modificar varios productos
server.put('/stockupdate', async (req, res) => {
  let dataToUpdate = [];
  try {
    let cart = req.body;
    cart.forEach((item) => {
      dataToUpdate.push({ id: item.id, quantity: item.quantity });
    });
    const updatedStock = await Promise.all(
      dataToUpdate.map(({ id, quantity }) =>
        Product.findByPk(id).then((product) =>
          product.update({ stock: product.dataValues.stock - quantity })
        )
      )
    );

    return res.status(200).send(updatedStock);
  } catch (error) {
    console.error(error);
    return res.send(500).send({ message: 'error al confirmar la orden' });
  }
});

//Modificar Producto

server.put(
  '/:id',

  async (req, res) => {
    let { id } = req.params;
    let {
      name,
      price,
      description,
      yearHarvest,
      image,
      stock,
      categories,
      strain,
    } = req.body;
    if (!id) return res.status(400).send('El producto no existe');
    try {
      const wineToUpdate = await Product.findByPk(id); // Instanciamos el producto a ser modificado

      const updatedWine = await wineToUpdate.update(
        {
          name,
          price,
          description,
          yearHarvest,
          image,
          stock,
          strainId: strain && parseInt(strain),
        },
        {
          returning: true,
          plain: true,
        }
      );
      //* Actualizamos la instrancia y lo guardamos en un objeto

      //* Si recibimos categorias las `seteamos` (pisamos los valores anteriores)
      if (categories && categories.length > 0) {
        categories = categories.filter((c) => c !== '');
        await updatedWine.setCategories([...categories]);
      }
      return res.status(200).send(updatedWine); //* Devuelve objeto actualizado
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

//Eliminar un Producto

server.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    let { id } = req.params;
    let wine;
    let categories;

    if (!id) return res.status(400).send('No se recibio ID');
    try {
      //* Instanciamos el prod a borrar y las categorias correspondientes a ese prod
      wine = await Product.findOne({ where: { id } });
      categories = await Category.findAll({
        include: { model: Product, where: { id } },
      });
      const payload = {
        wine,
        categories,
      };
      await wine.destroy();
      return res.status(200).send(payload); //? devolvemos el producto borrado con sus categorias correspondientes
    } catch (error) {
      return res.status(500).send('No se pudo borrar el producto');
    }
  }
);

//Borrar categoría de un producto

server.delete(
  '/:idProduct/category/:idCategory',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  (req, res) => {
    const { idProduct, idCategory } = req.params;
    if (!idProduct || idCategory)
      return res.status(400).send('No existe el producto o la categoría');
    Product.findOne({
      where: { id: idProduct },
    })
      .then((prod) => {
        prod.removeCategory([idCategory]);
        res.sendStatus(200);
      })
      .catch((e) => console.log(e));
  }
);

//Crear un nuevo Producto

server.post(
  '/',

  async (req, res) => {
    let {
      name,
      price,
      description,
      yearHarvest,
      image,
      stock,
      categories,
      strain,
    } = req.body;
    try {
      //* Instanciamos el producto a crear
      let product = await Product.create({
        name,
        price,
        description,
        yearHarvest,
        image,
        stock,
        strainId: strain && parseInt(strain),
      });
      //* loopeamos por las categorias recibidas y las asignamos
      await categories.forEach((categoryId) => {
        if (categoryId !== '') {
          Category.findByPk(categoryId)
            .then((category) => product.addCategory(category))
            .catch((err) => console.error(err));
        }
      });
      return res.status(200).send(product); //? devuelve el producto creado
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

//Agregar categoría a un Producto

server.post(
  '/:idProduct/category',

  (req, res) => {
    let { idProduct } = req.params;
    let { Category } = req.body;

    if (!idProduct || Category)
      return res.status(400).send('No se puede agregar la categoría');
    Product.findByPk(idProduct).then((product) => {
      product.addCategory(Category);
      return res.send('Se agregó la categoría');
    });
  }
);

module.exports = server;
