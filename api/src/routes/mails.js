require('dotenv').config();
const express = require('express');
const sendMailRouter = express.Router();
const nodemailer = require('nodemailer');

const transport = {
  // OPCIÓN 1
  service: 'gmail',
  //

  // OPCIÓN 2
  // host: "smtp.gmail.com",
  // port: 587,
  // secure: false,
  //
  auth: {
    user: process.env.THE_EMAIL,
    pass: process.env.THE_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport);

// Para registro, para confirmar compra, cambio de password, promovido

sendMailRouter.post('/', (req, res) => {
  let text;
  let subject;
  let { name, email, type, orderCod } = req.body;
  if (type === 'Welcome') {
    subject = `Bienvenid@, ${name} a WineStore`;
    text =
      'Te damos la bienvenida a WineStore, ya estás listo para probar un buen vino!';
  } else if (type === 'Order') {
    subject = `Confirmación de compra N°${orderCod}`;
    text = `Te informamos que tu orden N°${orderCod} ya fue confirmada. Muchas gracias por tu compra.`;
  } else if (type === 'Promote') {
    subject = `${name} has sido promovido a Administrador`;
    text = 'Te damos la bienvenida al equipo de WineStore!';
  }
  if (type === 'Dispatch') {
    subject = 'Orden despachada';
    text = `${name} Tu orden esta en camino...`;
  }

  let mail = {
    from: process.env.THE_EMAIL,
    to: email,
    subject,
    text,
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log('NO se ha enviado el mail', err);
    } else {
      console.log('Se ha enviado el mail');
    }
  });
});

module.exports = sendMailRouter;
