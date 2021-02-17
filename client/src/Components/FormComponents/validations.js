import * as yup from 'yup';

export const validationSchema = yup.object({
  // product: yup
  //   .string()
  //   .min(2, 'El nombre del vino es muy corto')
  //   .max(50, 'El nombre del vino es muy largo')
  //   .required('Nombre requerido'),
  // cellar: yup
  //   .string()
  //   .min(2, 'Nombre de bodega muy corto')
  //   .max(50, 'Nombre de bodega muy largo')
  //   .required('Bodega requerida'),
  strain: yup
    .string()
    .min(2, 'Strain Name too short')
    .max(100, 'Strain Name to long')
    .required('Strain Name of wine is required'),
  wine_types: yup.string().required('Debe seleccionar un tipo'),
  //   year: yup
  //     .number('Harvest year must be a number')
  //     .min(4)
  //     .required('Harvest year is required')
  //     .positive('Harvest year must be a positive integer')
  //     .integer('Harvest year must be a positive integer'),
  //   price: yup
  //     .number('Price must be number')
  //     .positive('Price must be a positive real'),
  //   stock: yup
  //     .number('stock must be number')
  //     .positive('stock must be a positive real'),
  //   description: yup
  //     .string()
  //     .max(500, 'Description must be less than 500 characters')
  //     .required('product description is required'),
  //   url: yup.string().url('valid URL is required'),
  bday: yup.date().required('Indicar fecha de nac'),
});
