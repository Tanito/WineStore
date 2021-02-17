import { makeStyles } from '@material-ui/core';
import * as Yup from 'yup';
import { validationSchema } from '../FormComponents/validations';

export const checkoutStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
}));

export const reviewStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export const checkoutFields = {
  firstName: {
    name: 'firstName',
    label: 'Nombre*',
    requiredErrorMsg: 'Nombre requerido',
    minErrorMsg: 'Nombre debe ser > 2 caracteres',
  },
  lastName: {
    name: 'lastName',
    label: 'Apellido*',
    requiredErrorMsg: 'Apellido requerido',
    minErrorMsg: 'Apellido debe ser > 2 caracteres',
  },
  address: {
    name: 'address',
    label: 'Dirección*',
    requiredErrorMsg: 'Direccion requerida',
  },
  email: {
    name: 'email',
    label: 'Email',
    requiredErrorMsg: 'Email requerido',
    invalidErrorMsg: 'Formato de email invalido',
  },
  city: {
    name: 'city',
    label: 'Ciudad*',
    requiredErrorMsg: 'Debe ingresar una ciudad',
  },
  state: {
    name: 'state',
    label: 'Provincia/Ciudad',
    requiredErrorMsg: 'Debe ingresar Provincia/Ciudad',
  },
  zip: {
    name: 'zip',
    label: 'Codigo Postal*',
    requiredErrorMsg: 'CP requerido',
    invalidErrorMsg: 'Codigo postal invalido',
  },
  country: {
    name: 'country',
    label: 'Pais*',
    requiredErrorMsg: 'Debe indicar el pais',
  },
  cardName: {
    name: 'cardName',
    label: 'Nombre de titular*',
    requiredErrorMsg: 'Nombre y apellido de titular requerido',
    invalidErrorMsg: 'Nombre y apellido del titular inválido',
  },
  cardNumber: {
    name: 'cardNumber',
    label: 'Numero de tarjeta*',
    requiredErrorMsg: 'Numero de tarjeta requerido',
    invalidErrorMsg: 'Numero de tarjeta invalido',
  },
  expiryDate: {
    name: 'expDate',
    label: 'Válida hasta*',
    requiredErrorMsg: 'Debe indicar fecha de vencimiento',
    invalidErrorMsg: 'Fecha de vencimiento invalida',
  },
  cvv: {
    name: 'cvv',
    label: 'Código de seguridad*',
    requiredErrorMsg: 'CVV es requerido',
    invalidErrorMsg: 'Formato de CVV invalido',
  },
};

const {
  firstName,
  lastName,
  address,
  email,
  city,
  state,
  zip,
  country,
  cardName,
  cardNumber,
  expiryDate,
  cvv,
} = checkoutFields;

export const initialState_Checkout = {
  //?ADDRESS FORM
  [firstName.name]: '',
  [lastName.name]: '',
  [address.name]: '',
  [email.name]: '',
  [city.name]: '',
  [state.name]: '',
  [zip.name]: '',
  [country.name]: '',
  //?PAYMENT FORM
  [cardName.name]: '',
  [cardNumber.name]: '',
  [expiryDate.name]: '',
  [cvv.name]: '',
};

export const checkoutValidationSchema = [
  Yup.object().shape({
    [firstName.name]: Yup.string()
      .required(`${firstName.requiredErrorMsg}`)
      .min(2, `${firstName.minErrorMsg}`),
    [lastName.name]: Yup.string()
      .required(`${lastName.requiredErrorMsg}`)
      .min(2, `${lastName.minErrorMsg}`),
    [address.name]: Yup.string().required(`${address.requiredErrorMsg}`),
    [email.name]: Yup.string()
      .email(`${email.invalidErrorMsg}`)
      .required(`${email.requiredErrorMsg}`),
    [city.name]: Yup.string().nullable().required(`${city.requiredErrorMsg}`),
    [state.name]: Yup.string().nullable().required(`${state.requiredErrorMsg}`),
    [zip.name]: Yup.string()
      .required(`${zip.requiredErrorMsg}`)
      .test('len', `${zip.invalidErrorMsg}`, (val) => val && val.length < 5),
    [country.name]: Yup.string()
      .nullable()
      .required(`${country.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [cardName.name]: Yup.string().required(`${cardName.requiredErrorMsg}`)
    .matches(/^[a-z ,.'-]+$/i, cardName.invalidErrorMsg),
    // .test(/^[a-z ,.'-]+$/i),
    [cardNumber.name]: Yup.string().required(`${cardNumber.requiredErrorMsg}`)
    .test('len', `${cardNumber.invalidErrorMsg}`, (val) => val && val.length === 16),
      // .matches(visaRegEx, cardNumber.invalidErrorMsg),
    [expiryDate.name]: Yup.string()
      .nullable()
      .required(`${expiryDate.requiredErrorMsg}`)
      .matches(/^\d{2}\/\d{2}$/g, expiryDate.invalidErrorMsg),
      
    //   .test('expDate', expiryDate.invalidErrorMsg, (val) => {
    //     if (val) {
    //       const startDate = new Date();
    //       const endDate = new Date(2050, 12, 31);
    //       if (moment(val, moment.ISO_8601).isValid()) {
    //         return moment(val).isBetween(startDate, endDate);
    //       }
    //       return false;
    //     }
    //     return false;
    //   }),
    [cvv.name]: Yup.string()
      .required(`${cvv.requiredErrorMsg}`)
      .test('len', `${cvv.invalidErrorMsg}`, (val) => val && val.length === 3),
  }),
];
