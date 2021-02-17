import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
  userOrdersSelector,
  userOrdersStatusSelector,
  userSelector,
  reviewsListSelector,
  reviewsListStatusSelector,
} from '../../selectors/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { Link, CircularProgress, Button } from '@material-ui/core';
import { getUserOrders } from '../../slices/userSlice';
import { getUserReviews } from '../../slices/reviewSlice';
import { search } from '../utils/index';
import UserReview from '../Review/UserReview';
import './Profile.modules.css';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
  };
}

function Row(props) {
  const { row, order, review } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const reviews = useSelector(reviewsListSelector);

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {order.id}
        </TableCell>
        <TableCell align="right">{order.total}</TableCell>
        <TableCell align="right">{order.status}</TableCell>
        {/* <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio unitario</TableCell>
                    <TableCell align="right"> Precio total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.map((historyRow) => (
                    <TableRow key={historyRow.id}>
                      <TableCell component="th" scope="row">
                        {historyRow.quantity}
                      </TableCell>
                      <TableCell>{historyRow.product.name}</TableCell>
                      <TableCell align="right">
                        {historyRow.product.price}
                      </TableCell>
                      <TableCell align="right">
                        {historyRow.product.price * historyRow.quantity}
                      </TableCell>
                      <TableCell align="right">
                        {review && search(historyRow.product.id, reviews) ? (
                          <UserReview data={historyRow} />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const status = useSelector(userOrdersStatusSelector);
  const orders = useSelector(userOrdersSelector);

  const userStatus = useSelector(userOrdersStatusSelector);
  const reviewStatus = useSelector(reviewsListStatusSelector);
  let allUserOrders;

  useEffect(() => {
    if (userStatus === 'idle') dispatch(getUserOrders(user.id));
    if (reviewStatus === 'idle') dispatch(getUserReviews(user.id));
  }, [userStatus, reviewStatus, dispatch]);

  if (status === 'loading' || reviewStatus === 'loading') {
    allUserOrders = (
      <>
        <h2>Cargando...</h2>
        <CircularProgress />
      </>
    );
  } else if (status === 'succeded' && reviewStatus === 'succeded') {
    if (orders.length === 0) {
      allUserOrders = (
        <h3 className="emptyOrders">
          Aún no tiene compras realizadas o pendientes
        </h3>
      );
    } else {
      return (
        <div>
          <Paper className="profile">
            {' '}
            <h4 className="title">Mi información</h4>
            <div className="info">
              <p className="data">
                Nombre {user.firstName + ' ' + user.lastName}
              </p>
              <p className="data">email {user.email}</p>
              <p className="data">Fecha de nacimiento {user.birthdate}</p>
              <p className="data">Télefono/celular {user.cellphone}</p>
            </div>
            <h4 className="title">Mis compras</h4>
            {allUserOrders}
          </Paper>
          <TableContainer component={Paper} className="Table__Container">
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Codigo Compra</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Status</TableCell>
                  {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  (allUserOrders = orders.map((row) => (
                    <Row
                      key={row.id}
                      row={row.orderLines}
                      order={row}
                      review={row.status === 'completed' ? true : false}
                    />
                  )))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    }
  } else if (status === 'failed' || reviewStatus === 'failed') {
    allUserOrders = (
      <>
        <h3>Ha ocurrido un error</h3>
      </>
    );
  }

  return (
    <Paper className="profile">
      {' '}
      <h4 className="title">Mi información</h4>
      <div className="info">
        <p className="data">Nombre {user.firstName + ' ' + user.lastName}</p>
        <p className="data">email {user.email}</p>
        <p className="data">Fecha de nacimiento {user.birthdate}</p>
        <p className="data">Télefono/celular {user.cellphone}</p>
      </div>
      <h4 className="title">Mis compras</h4>
      {allUserOrders}
    </Paper>
  );
}
