import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Button,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
//import GitHubIcon from '@material-ui/icons/GitHub';
import FormField from '../../FormComponents/FormField';
import './UserForm.modules.css';
//import { validationSchemaUserRegister } from './userValidations';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import {
  githubLogin,
  googleLogin,
  postUserLogin,
  resetStatus,
} from '../../../slices/userSlice.js';
//import { postProductToCart, login } from '../../../slices/productsCartSlice.js';
import { userSelector, userLoginStatusSelector } from '../../../selectors';
//import axios from 'axios';

function UserLogin() {
  const dispatch = useDispatch();
  const [redirecting, setRedirecting] = useState(false);
  //const user = useSelector(userSelector);
  const userStatus = useSelector(userLoginStatusSelector);
  const history = useHistory();
  const [viewPassword, setViewPassword] = useState(false);
  const emptyValues = {
    email: '',
    password: '',
  };

  const handleSubmit = (values, formik) => {
    const payload = {
      user: {
        email: values.email,
        password: values.password,
      },
      formik,
    };
    dispatch(postUserLogin(payload)).then(() => {
      if (userStatus === 'succeded') {
        history.push('/catalogue');
      } else if (userStatus === 'failed') {
        dispatch(resetStatus());
      }
    });
  };

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

  const githubLoginHandler = () => {
    dispatch(githubLogin());
    setRedirecting(true);
  };
  const googleLoginHandler = () => {
    dispatch(googleLogin());
    setRedirecting(true);
  };

  return (
    <Container className="formUserLogin">
      {redirecting ? (
        <CircularProgress />
      ) : (
        <Formik
          initialValues={emptyValues}
          //   validationSchema={validationSchemaUserRegister}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Container>
              <Form>
                <FormField
                  fieldType="input"
                  label="Correo Electronico"
                  name="email"
                  required
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
                <br></br>
                <Container className="center">
                  <Button type="submit" id="btnUser">
                    Login
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
                  <hr></hr>
                  <br></br>
                  <div className="Login__Externos">
                    <Button onClick={githubLoginHandler} variant="outlined">
                      <i class="fab fa-github iconos" aria-hidden="true"></i>
                      GitHub {/* </a> */}
                    </Button>
                    <Button variant="outlined" onClick={googleLoginHandler}>
                      <i class="fab fa-google iconos"></i>
                      Google
                    </Button>
                  </div>
                  <br></br>
                </Container>
              </Form>
            </Container>
          )}
        </Formik>
      )}
    </Container>
  );
}

export default UserLogin;
