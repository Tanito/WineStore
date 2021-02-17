import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Container, Button, CircularProgress } from "@material-ui/core";
import { Formik, Form } from "formik";
import FormField from "../../FormComponents/FormField";

import { usersListSelector, userStatusSelector } from "../../../selectors";
import { editUsers } from "../../../slices/userSlice";

function EditUser(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const users = useSelector(usersListSelector);
  const status = useSelector(userStatusSelector);

  let id = parseInt(props.match.params.id);
  let userToEdit = users.filter((u) => u.id === id);

  const emptyValues = {
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
    birthdate: new Date("01/01/2000"),
  };

  const editValues = {
    firstName: userToEdit[0].firstName,
    lastName: userToEdit[0].lastName,
    email: userToEdit[0].email,
    cellphone: userToEdit[0].cellphone,
    birthdate: new Date(userToEdit[0].birthdate),
  };

  const handleSubmit = (values, formik) => {
    let payload = {
      id,
      values
    }
    dispatch(editUsers(payload));
    history.push('/dashboard');
  };

  const handleReset = (formik) => {
    //func para resetear el form
    formik.resetForm({
      values: { ...emptyValues },
      errors: { ...emptyValues },
    });
  };

  if (status === "loading") {
    return (
      <>
        <h2>Cargando...</h2>
        <CircularProgress />
      </>
    );
  } else if (status === "succeded") {
    return (
      <Container className="formUser">
        <Formik
          initialValues={editValues}
          // validationSchema={validationSchemaUserRegister}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Container>
              <Form>
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
                  placeholder={"dd/mm/aaaa"}
                />
                <FormField
                  fieldType="input"
                  label="Teléfono"
                  name="cellphone"
                  className="text__field UserForm__lb"
                />
                <br></br>
                <Container className="center">
                  <Button type="submit" id="btnUser">
                    Actualizar
                  </Button>
                  <br></br>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleReset(formik)}
                    type="reset"
                  >
                    CLEAR
                  </Button>
                  <Button variant="outlined" color="secondary">
                    RESETEAR PASSWORD
                  </Button>
                </Container>
                <br></br>
                <Container>
                  <Button variant="contained" color="primary" type="reset">
                    BORRAR USUARIO
                  </Button>
                </Container>
              </Form>
            </Container>
          )}
        </Formik>
      </Container>
    );
  }
}

export default EditUser;
