import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  Container,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import FormField from '../../FormComponents/FormField';
import './UserForm.modules.css';
import { validationSchemaUserRegister } from './userValidations';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { createUser, sendEmail } from '../../../slices/userSlice';
import { useHistory } from 'react-router-dom';
import {
  userErrorSelector,
  userLoginStatusSelector,
  userSelector,
} from '../../../selectors/index.js';

function UserForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [viewPassword, setViewPassword] = useState(false);
  const status = useSelector(userLoginStatusSelector);
  const error = useSelector(userErrorSelector);
  const info = useSelector(userSelector);

  const emptyValues = {
    firstName: '',
    lastName: '',
    email: '',
    cellphone: '',
    birthdate: new Date('01/01/2000'),
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = (values, formik) => {
    const payload = {
      user: { ...values },
      formik,
    };
    dispatch(createUser(payload));
  };

  const emailTaken = () => {
    info.formik.setSubmitting(false);
    info.formik.setErrors({ email: 'El email ya está registrado' });

    info.formik.setFieldValue('password', '', false);
    info.formik.setFieldTouched('password', true);
    info.formik.setFieldValue('confirmPassword', '', false);
    info.formik.setFieldTouched('confirmPassword', true);
  };

  useEffect(() => {
    if (status === 'succeded') {
      history.push('/welcome');
      dispatch(
        sendEmail({ name: info.firstName, email: info.email, type: 'Welcome' })
      );
    }
    if (status === 'failed') {
      error.message.includes('409') ? emailTaken() : history.push('/failure');
    }
  }, [status]);

  const handleReset = (formik) => {
    //func para resetear el form
    formik.resetForm({
      values: { ...emptyValues },
      errors: { ...emptyValues },
    });
  };

  const handleClickShowPassword = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <Container className="formUserLogin">
      <Formik
        initialValues={emptyValues}
        // validationSchema={validationSchemaUserRegister}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Container>
            <Form>
              {/* <Field>
                {({ field, meta, form }) => <>{console.log(form)}</>}
              </Field> */}
              <FormField
                fieldType="input"
                label="Nombre"
                name="firstName"
                required
                className="text__field UserForm__lb"
              />
              <FormField
                fieldType="input"
                label="Apellido"
                name="lastName"
                required
                className="text__field UserForm__lb"
              />
              <FormField
                fieldType="input"
                label="Correo Electronico"
                name="email"
                required
                className="text__field UserForm__lb"
              />
              <FormField
                fieldType="datepicker"
                label="Fecha de Nacimiento"
                name="birthdate"
                required
                className="text__field UserForm__lb"
                placeholder={'dd/mm/aaaa'}
              />
              <FormField
                fieldType="input"
                label="Teléfono"
                name="cellphone"
                className="text__field UserForm__lb"
              />
              <FormField
                fieldType="input"
                label="Contraseña"
                name="password"
                required
                className="text__field UserForm__lb"
                type={viewPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {viewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormField
                fieldType="input"
                label="Repetir Contraseña"
                name="confirmPassword"
                required
                className="text__field UserForm__lb"
                type="password"
                type={viewPassword ? 'text' : 'password'}
              />
              <br></br>
              <Container className="center">
                <Button type="submit" id="btnUser">
                  Registrarse
                </Button>
                <br></br>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleReset(formik)}
                  type="reset"
                >
                  RESET
                </Button>
              </Container>
            </Form>
          </Container>
        )}
      </Formik>
    </Container>
  );
}

export default UserForm;
