import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { reviewsListSelector } from '../../selectors/index.js';
import { useSelector } from 'react-redux';
import { search, sliceTime, sliceHour } from '../utils/index';
import UserReview from '../Review/UserReview';
import { Link } from 'react-router-dom';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row, order, review } = props;
  const [open, setOpen] = useState(false);
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
          {sliceTime(order.updatedAt) + ' ' + sliceHour(order.updatedAt)}
        </TableCell>
        <TableCell component="th" scope="row">
          {order.id}
        </TableCell>
        <TableCell align="right">{order.total}</TableCell>
        <TableCell align="right">{order.status}</TableCell>
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
                      <TableCell>
                        {' '}
                        <Link to={`/product/${historyRow.product.id}`}>
                          {historyRow.product.name}
                        </Link>
                      </TableCell>
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

export default Row;
