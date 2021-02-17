import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { checkoutFields } from './checkoutHelpers';
import InputField from '../FormComponents/FieldComponents/InputField';
import { useState, Component } from 'react';
import { TextField } from 'formik-material-ui';
import { Field } from 'formik';

export default function PaymentForm({ formik }) {
  const { cardName, cardNumber, expiryDate, cvv } = checkoutFields;
  // let paymentInfoStorage = JSON.parse(localStorage.getItem('paymentInfo'));
  // const [paymentInfo, setPaymentInfo] = React.useState({
  //   cardName: paymentInfoStorage.cardName,
  //   cardNumber: paymentInfoStorage.cardNumber,
  //   expDate: paymentInfoStorage.expDate,
  //   cvv: paymentInfoStorage.cvv,
  // });

  // useEffect(() => {
  //   localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
  // }, [paymentInfo]);

  // window.addEventListener('beforeunload', (event) => {
  //   setPaymentInfo({
  //     cardName: document.getElementById('cardName'),
  //     cardNumber: document.getElementById('cardNumber'),
  //     expDate: document.getElementById('expDate'),
  //     cvv: document.getElementById('cvv'),
  //   });
  //   localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
  // });

  // const handleInputChange = function (e) {
  //   setPaymentInfo({
  //     ...paymentInfo,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Método de Pago
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Field
            component={TextField}
            name={cardName.name}
            label={cardName.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            component={TextField}
            name={cardNumber.name}
            label={cardNumber.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            component={TextField}
            name={expiryDate.name}
            label={expiryDate.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            component={TextField}
            name={cvv.name}
            label={cvv.label}
            fullWidth
          />
        </Grid>
      </Grid>
      <div id="PaymentForm">
        <Cards
          cvc={formik.values.cvv}
          expiry={formik.values.expDate}
          name={formik.values.cardName}
          number={formik.values.cardNumber}
        />
      </div>
    </React.Fragment>
  );
}
