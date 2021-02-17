import React, { useEffect, useState } from 'react';
import { Paper, CircularProgress, Button, Container } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import './Profile.modules.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  userOrdersStatusSelector,
  userOrdersSelector,
  userSelector,
  reviewsListStatusSelector,
} from '../../selectors/index.js';
import { getUserOrders, editUsers } from '../../slices/userSlice';
import { getUserReviews } from '../../slices/reviewSlice';
import Row from '../Profile/ProfileTable';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import EditIcon from '@material-ui/icons/Edit';
import { Formik, Form } from 'formik';
import FormField from '../FormComponents/FormField';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const userStatus = useSelector(userOrdersStatusSelector);
  const orders = useSelector(userOrdersSelector);
  const reviewStatus = useSelector(reviewsListStatusSelector);
  const [state, setState] = useState({
    dispatched: true,
    canceled: true,
    pending: true,
    completed: true,
    cart: true,
    finished: true,
  });
  const [edit, setEdit] = useState(false);

  const { cart, canceled, completed, dispatched, pending, finished } = state;
  let allUserOrders;

  let states = [];
  for (const prop in state) {
    if (state[prop] === true) {
      states.push(prop);
    }
  }

  useEffect(() => {
    dispatch(getUserOrders(user.id));
    dispatch(getUserReviews(user.id));
  }, [dispatch, state]);

  const editValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    cellphone: user.cellphone,
    birthdate: new Date(user.birthdate),
  };

  const handleSubmit = (values, formik) => {
    let payload = {
      id: user.id,
      values,
    };
    dispatch(editUsers(payload));
    setEdit(false);
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  if (orders.length === 0 && userStatus !== 'succeded') {
    allUserOrders = (
      <h3 className="emptyOrders1">
        Aún no tiene compras realizadas o pendientes
      </h3>
    );
  } else {
    if (userStatus === 'loading' || reviewStatus === 'loading') {
      allUserOrders = (
        <>
          <h2>Cargando...</h2>
          <CircularProgress />
        </>
      );
    } else if (userStatus === 'succeded' && reviewStatus === 'succeded') {
      return (
        <Paper className="profile">
          <h4 className="title">
            Mi información
            <Button className="editButton" onClick={() => setEdit(true)}>
              <EditIcon className="edit"></EditIcon>
            </Button>
          </h4>
          <Container className="formUser1">
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
                      disabled={edit ? false : true}
                      required
                      className="text__field UserForm__lb"
                    />
                    <FormField
                      fieldType="input"
                      label="Apellido"
                      name="lastName"
                      disabled={edit ? false : true}
                      required
                      className="text__field UserForm__lb"
                    />
                    <FormField
                      fieldType="input"
                      label="Correo Electronico"
                      name="email"
                      disabled={edit ? false : true}
                      required
                      className="text__field UserForm__lb"
                    />
                    <FormField
                      fieldType="datepicker"
                      label="Fecha de Nacimiento"
                      name="birthdate"
                      disabled={edit ? false : true}
                      required
                      className="text__field UserForm__lb"
                      placeholder={'dd/mm/aaaa'}
                    />
                    <FormField
                      fieldType="input"
                      label="Teléfono"
                      name="cellphone"
                      disabled={edit ? false : true}
                      className="text__field UserForm__lb"
                    />
                    <br></br>
                    <Container
                      className="center"
                      style={{ display: edit ? 'block' : 'none' }}
                    >
                      <Button type="submit" id="btnUser">
                        Actualizar
                      </Button>
                    </Container>
                  </Form>
                </Container>
              )}
            </Formik>
          </Container>
          <h4 className="title">Mis compras</h4>
          <div className="orders">
            <FormControl>
              <FormLabel>Filtro de órdenes</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      className="checkbox"
                      checked={dispatched}
                      onChange={handleChange}
                      name="dispatched"
                    />
                  }
                  label="Dispatched"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="checkbox"
                      checked={canceled}
                      onChange={handleChange}
                      name="canceled"
                    />
                  }
                  label="Canceled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="checkbox"
                      checked={cart}
                      onChange={handleChange}
                      name="cart"
                    />
                  }
                  label="Cart"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="checkbox"
                      checked={pending}
                      onChange={handleChange}
                      name="pending"
                    />
                  }
                  label="Pending"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="checkbox"
                      checked={completed}
                      onChange={handleChange}
                      name="completed"
                    />
                  }
                  label="Completed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="checkbox"
                      checked={finished}
                      onChange={handleChange}
                      name="finished"
                    />
                  }
                  label="Finished"
                />
              </FormGroup>
            </FormControl>
            <div className="ordersInfo">
              {allUserOrders}
              <TableContainer component={Paper} className="Table__Container">
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Fecha de compra</TableCell>
                      <TableCell>Codigo Compra</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length > 0
                      ? (allUserOrders = orders.map((row) =>
                          states.includes(row.status) ? (
                            <Row
                              key={row.id}
                              row={row.orderLines}
                              order={row}
                              review={row.status === 'completed' ? true : false}
                            />
                          ) : null
                        ))
                      : (allUserOrders = (
                          <h3 className="emptyOrders1">
                            Aún no tiene compras realizadas o pendientes
                          </h3>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </Paper>
      );
    } else if (userStatus === 'failed' || reviewStatus === 'failed') {
      allUserOrders = (
        <>
          <h3>Ha ocurrido un error</h3>
        </>
      );
    }
  }
  return <Paper>{allUserOrders}</Paper>;
}
