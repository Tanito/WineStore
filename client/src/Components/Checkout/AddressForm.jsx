import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import FormField from '../FormComponents/FormField';
import { checkoutFields } from './checkoutHelpers';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-material-ui';

const {
  firstName,
  lastName,
  address,
  email,
  city,
  state,
  zip,
  country,
} = checkoutFields;

export default function AddressForm() {
  const { values: formValues } = useFormikContext();

  // Traemos la info de la dirección de facturación del local storage

  let addressInfoStorage = JSON.parse(localStorage.getItem('addressInfo'));

  const [addressInfo, setAddressInfo] = useState({
    firstName: addressInfoStorage.firstName,
    lastName: addressInfoStorage.lastName,
    address1: addressInfoStorage.address,
    email: addressInfoStorage.email,
    city: addressInfoStorage.city,
    state: addressInfoStorage.state,
    zip: addressInfoStorage.zip,
    country: addressInfoStorage.country,
  });

  useEffect(() => {
    //guardamos la info de la dirección de facturación en el local storage
    // localStorage.setItem('addressInfo', JSON.stringify(addressInfo));
    // return () => {
    //   console.log('UNMOUNT', formValues.firstName);
    //   localStorage.setItem(
    //     'addressInfo',
    //     JSON.stringify({
    //       firstName: formValues.firstName,
    //       lastName: formValues.lastName,
    //       address1: formValues.address,
    //       email: formValues.email,
    //       city: formValues.city,
    //       state: formValues.state,
    //       zip: formValues.zip,
    //       country: formValues.country,
    //     })
    //   );
    // };
  }, [addressInfo]);

  // Antes de refrescar, guardamos la info en el localstorage, para evitar que tenga que volver a cargar los datos

  window.addEventListener('beforeunload', (event) => {
    // setAddressInfo({
    //   firstName: formValues.firstName,
    //   lastName: formValues.lastName,
    //   address1: formValues.address,
    //   email: formValues.email,
    //   city: formValues.city,
    //   state: formValues.state,
    //   zip: formValues.zip,
    //   country: formValues.country,
    // });
    localStorage.setItem(
      'addressInfo',
      JSON.stringify({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        address1: formValues.address,
        email: formValues.email,
        city: formValues.city,
        state: formValues.state,
        zip: formValues.zip,
        country: formValues.country,
      })
    );
  });

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Direccion de envio
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Field
            component={TextField}
            name={firstName.name}
            label={firstName.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            component={TextField}
            name={lastName.name}
            label={lastName.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name={address.name}
            label={address.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name={email.name}
            label={email.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            component={TextField}
            name={city.name}
            label={city.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            component={TextField}
            name={state.name}
            label={state.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            component={TextField}
            name={zip.name}
            label={zip.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            component={TextField}
            name={country.name}
            label={country.label}
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
