const server = require('express').Router();
const { Strain } = require('../db.js');

//Listados de Strains (Cepas)

server.get('/', (req, res, next) => {
  Strain.findAll()
    .then((strain) => {
      return res.status(200).json(strain);
    })
    .catch(next);
});

//Creo o modifico cepa

server.post('/', (req, res) => {
  let { name, description, pairing, origin } = req.body;
  if (!name)
    return res.status(400).send('No se puede crear o modificar la cepa');

  Strain.findOrCreate({
    where: {
      name,
    },
    defaults: {
      name,
      description,
      pairing,
      origin,
    },
  }).then((strain) => {
    return res.status(201).send(strain);
  });
});

//Eliminar Cepa

server.delete('/:id', (req, res) => {
  let { id } = req.params;
  if (!id) return res.status(400).send('No se puede eliminar la cepa');
  Strain.destroy({
    where: {
      id,
    },
  }).then((strain) => {
   return res.sendStatus(200).send(strain);
  });
});

module.exports = server;
