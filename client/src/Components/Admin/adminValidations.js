import * as yup from 'yup';

//* Objecto de validacion para formulario de carga de producto (Reducer: postNewProduct;POST: '/products')
export const validationSchemaLoadProducts = yup.object({
  name: yup
    .string()
    .required('El nombre del producto es requerido')
    .min(2, 'El nombre del producto es demasiado corto')
    .max(50, 'El nombre del producto es demasiado largo'),
  // strain: yup.string().required('Es necesario indicar la cepa'),
  yearHarvest: yup
    .number()
    .integer()
    .positive('El año de cosecha no puede ser negativo')
    .min(1900, 'El año de cosecha debe ser >1900')
    .required('Debe indicar año de cosecha'),
  stock: yup
    .string()
    .max(500, 'La descricion no puede exceder los 500 caracteres'),
  price: yup
    .number('El precio debe ser un nombre')
    .positive('El precio debe ser positivo')
    .required('Debe indicar precio'),
  image: yup
    .string()
    .url('Debe ser una URL valida')
    .required('Debe pasar URL de img')
    .max(200, 'La URL no puede exceder los 200 caracteres'),
  description: yup
    .string()
    .max(500, 'Descripcion demasiado larga')
    .required('Es necesario dejar una descripcion'),
});

//* Objeto para validacion de cepas
export const validationSchemaLoadStrains = yup.object({
  name: yup.string().required('El nombre de la cepa es requerido'),
  description: yup
    .string()
    .max(500, 'Descripcion demasiado largo')
    .required('Descripcion de cepa requerida'),
  pairing: yup
    .string()
    .max(250, 'Maridaje demasiado largo')
    .required('Maridaje es requerido'),
  origin: yup
    .string()
    .max(50, 'Origen demasiado largo')
    .required('El origen de la cepa es requerido'),
});

export const validationSchemaLoadCategories = yup.object({
  taste: yup.string().required('El nombre de la categoría es requerido'),
});
