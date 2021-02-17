const server = require('express').Router();
const { User } = require('../db.js');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { makeJWT, cookieMaker, refreshTime } = require('../utils');

// Ruta ME
server.get('/me', async (req, res, next) => {
  try {
    if (req.user) {
      const { id } = req.user;
      const result = await User.findOne(id);
      res.json(result);
    } else res.sendStatus(401);
  } catch (error) {
    next(error);
  }
});

// Ruta para desloguearse (Habría que probarla a ver si anda)

server.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('refreshToken');
  res.status(200).send('Cerrar sesión');
});

server.post('/register/guest', async (req, res) => {
  try {
    const { user } = req.body;
    const email = user.email;
    if (!user || email)
      return res.status(400).send({ message: 'No se recibio usuario o email' });

    const userDB = await User.findOne({ where: { email }, paranoid: false });

    const birthdate = userDB.dataValues.birthdate || new Date('01-01-1250');
    const password = String(Date.now() + Math.random()).substring(0, 7);
    const cellphone = user.cellphone || 123456789;

    const user_data = {
      firstName: user.firstName,
      lastName: user.lastName,
      email,
      birthdate,
      password,
      cellphone,
      isAdmin: false,
      guest: true,
    };
    if (userDB) {
      //fabricamos datos faltos
      const updated_user = await userDB.update(user_data);
      return res.status(200).send(updated_user);
    } else {
      const new_user = await User.create(user_data);
      return res.status(200).send(new_user);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('ERRRORRRRRR');
  }
});

//Ruta para Registrarse
server.post(
  '/register',
  passport.authenticate('register-local', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(400).send({ message: 'Usuario ya existe' });
      const token = makeJWT(req.user, refreshTime, 'Bearer');
      const refresh_token = makeJWT(req.user);
      cookieMaker('refreshToken', refresh_token, res);
      return res.send({
        message: 'Registro exitoso',
        token,
        user,
      });
    } catch (error) {
      console.error(`CATCH REGISTER`, error);
    }
  }
);

//Ruta para Loguearse
server.post(
  '/login',
  passport.authenticate('local-login', {
    failWithError: false,
    session: false,
  }),
  async (req, res) => {
    try {
      const token = makeJWT(req.user, refreshTime, 'Bearer'); // guardar los tiempos de refresh en variable y aplicarselo a ambas
      const refresh_token = makeJWT(req.user);
      cookieMaker('refreshToken', refresh_token, res);
      return res.send({
        message: 'Login exitoso',
        token,
        user: req.user,
      });
    } catch (error) {
      console.error(`CATCH LOGIN`, error);
    }
  }
);

server.get(
  '/refresh',
  passport.authenticate('jwt-refresh', { session: false }),
  async (req, res) => {
    const user = req.user;
    const newToken = makeJWT(user, refreshTime, 'Bearer');
    const refresh_token = makeJWT(user);
    cookieMaker('refreshToken', refresh_token, res);
    return res.send({
      message: 'Refresh exitoso',
      newToken,
      user,
    });
  }
);

//*ruta para probar la validacion con el JWT
server.get(
  '/test',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
   return res.send('prueba de ruta protegia');
    // return res.send(req.user);
  }
);

// Hacer admin a un user (promote User)

server.put('/:id', (req, res) => {
  let { id } = req.params;
  if (!id) return res.status(400).send('El usuario no existe');

  User.findByPk(id)
    .then(User.update({ isAdmin: true }, { where: { id } }))
    .then(() => {
      return res.status(200).send('Se ha ascendido el usuario a Admin');
    });
});

//Reiniciar la contraseña (Modificarla para usarla desde un admin)

server.put('/pass/:id', (req, res) => {
  let { id } = req.params;
  let { password } = req.body;

  if (!id) return res.status(400).send('El usuario no existe');

  User.findByPk(id)
    .then(User.update({ password }, { where: { id } }))
    .then(() => {
      return res
        .status(200)
        .send('Se ha modificado la contraseña correctamente');
    });
});

server.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  (req, res) => {}
);

server.get(
  '/github/callback',
  passport.authenticate('github'),
  async (req, res) => {
    try {
      const token = makeJWT(req.user, refreshTime, 'Bearer'); // guardar los tiempos de refresh en variable y aplicarselo a ambas
      const refresh_token = makeJWT(req.user);
      cookieMaker('refreshToken', refresh_token, res);
      return res.redirect('http://localhost:3001/');
    } catch (error) {
      console.error(`CATCH GIT`, error);
    }
  }
);

server.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  }),
  (req, res) => {}
);

server.get(
  '/google/callback',
  passport.authenticate('google'),
  async (req, res) => {
    try {
      const token = makeJWT(req.user, refreshTime, 'Bearer'); // guardar los tiempos de refresh en variable y aplicarselo a ambas
      const refresh_token = makeJWT(req.user);
      cookieMaker('refreshToken', refresh_token, res);
      return res.redirect('http://localhost:3001/');
    } catch (error) {
      console.error(`CATCH GOOGLE`, error);
    }
  }
);

module.exports = server;
