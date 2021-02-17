import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Container, Button } from "@material-ui/core";
import { Formik, Form } from "formik";
import FormField from "../../FormComponents/FormField";
import { formatArrayToOption } from "../../utils/index";
import { userStatusSelector, usersListSelector } from "../../../selectors/index";
import { userPromote, sendEmail } from "../../../slices/userSlice";

function PromoteUser() {
  const dispatch = useDispatch();
  const userStatus = useSelector(userStatusSelector);
  const users = useSelector(usersListSelector);
  const [usersOption, setUsersOption] = useState([]);

  const handleSubmit = (values) => {
    let userId = values.usersToPromote;
    let userToPromote = users.filter(u => u.id === userId)
    dispatch(userPromote(userId));
    dispatch(sendEmail({ name: userToPromote[0].firstName, email: userToPromote[0].email, type: 'Promote'}));
  };

  const initialValues = {
    usersToPromote: "",
  };

  let content;

  useEffect(() => {
    if (userStatus === "succeded") {
        setUsersOption(formatArrayToOption(users, 'firstName'));
    }
  }, []);

  if (userStatus === "loading") {
    //* si loading renderizamos `Cargando...`
    content = (
      <>
        <h2>Cargando....</h2>
        <CircularProgress />
      </>
    );
  } else if (userStatus === "succeded") {
    content = (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Container>
            <Form>
              <FormField
                fieldType="select"
                label="Listado de usuarios"
                name="usersToPromote"
                options={usersOption}
                required
              />

              <br></br>
              <Container>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!formik.isValid}
                  type="submit"
                >
                  Promover
                </Button>
              </Container>
            </Form>
          </Container>
        )}
      </Formik>
    );
  }

  return <>{content}</>;
}

export default PromoteUser;