const { session } = require('passport');
const passport = require('passport');
const { User } = require('../db.js');

const checkAdmin = async (req, res, next) => {
  const { id, isAdmin } = req.user;
 
  if (isAdmin) {
    return next();
  } else {
    return res.status(401).send({ message: 'No posee el nivel de acceso' });
  }
};

exports.checkAdmin = checkAdmin;
