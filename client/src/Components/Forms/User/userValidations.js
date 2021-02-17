import * as yup from 'yup';
import differenceInYears from 'date-fns/differenceInYears';

export const validationSchemaUserRegister = yup.object({
  firstName: yup
    .string()
    .min(2, 'Nombre demasiado corto')
    .max(30, 'Nombre demasiado largo')
    .required('Nombre requerido'),
  lastName: yup
    .string()
    .min(2, 'Apellido demasiado corto')
    .max(30, 'Apellido demasiado largo')
    .required('Apellido requerido'),
  email: yup
    .string()
    .email('Formato de mail invalido')
    .required('Email requerido'),
  cellphone: yup.number('debe ingresar un nro valido'),
  birthdate: yup
    .date()
    .required()
    .typeError("formato de fecha no valido, debe ser de la forma 'dd-mm-aaaa'")
    .test({
      name: 'ageTest',
      exclusive: true,
      message: 'Debe ser mayor a 18 años',
      test: (value) => {
        return differenceInYears(new Date(), value) >= 18;
      },
    }),
  password: yup
    .string()
    .min(8, 'Contraseña minimo 8 caracteres')
    .max(20, 'Maximo 20 caracteres')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'La contraseña debe tener 8 caracteres, una mayuscula, un numero y un caracter especial'
    )
    .required('Debe ingresar contraseña'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'No coincide la contraseña')
    .required('debe confirmar la contraseña'),
});
