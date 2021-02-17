import React, { useEffect, useState } from 'react';
import { sliceTime, total } from '../utils';
import OrderDetail from './OrderDetail';

import Pagination from '@material-ui/lab/Pagination';
import './OrderTable.modules.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderTable, modificateOrder } from '../../slices/orderTableSlice';
//import { modificateOrder } from '../../slices/productsCartSlice';
import {
  allOrderSelector,
  allOrderStatusSelector,
  allProductsCartStatusSelector,
} from '../../selectors';
import { CircularProgress, Button } from '@material-ui/core';

import DoneIcon from '@material-ui/icons/Done';

// Esta tabla es para el admin.
// Tiene que mostrar todas las ordenes de todos los usuarios.

function OrderTable(props) {
  const dispatch = useDispatch();
  const orderTable = useSelector(allOrderSelector);
  const status = useSelector(allOrderStatusSelector);
  const statusCart = useSelector(allProductsCartStatusSelector);
  const orderStatus = [
    'cart',
    'pending',
    'completed',
    'dispatched',
    'finished',
    'canceled',
  ];
  const [value, setValue] = useState(0); // Rating traer promedio de calificación de base de datos según producto
  const [page, setPage] = useState(1);
  const cantidadAMostrar = 4;
  function handleClickPagination(e, num) {
    setPage(num);
  }

  let states = [];
  for (const prop in props.states) {
    if (props.states[prop] === true) {
      states.push(prop);
    }
  }

  let content;

  useEffect(() => {
    dispatch(getOrderTable());
  }, [dispatch, statusCart]);

  const handleRetry = () => {
    //func para reintentar y forzar refresh
    // history.push(props.location.pathname);
    window.location.reload();
    return false;
  };

  const handleClick = (id) => {
    let element = document.getElementById('option' + id).value;
    dispatch(modificateOrder({ myCart: id, status: element }));
  };

  if (status === 'loading') {
    content = (
      <>
        <h2>Cargando...</h2>
        <CircularProgress />
      </>
    );
  } else if (status === 'succeded') {
    content = orderTable
      .slice((page - 1) * cantidadAMostrar, page * cantidadAMostrar)
      .map((order, idx) => {
        let rowColor = idx % 2 === 0 ? 'white' : 'beige';
        return states.includes(order.status) ? (
          <>
            <li
              key={order.id}
              className="OrderTable__li"
              style={{ backgroundColor: rowColor }}
            >
              <div className="OrderTable__Text">{order.id}</div>
              <div className="OrderTable__Text">
                {Math.ceil((total(order.orderLines) * 121) / 100)}
              </div>
              <select id={'option' + order.id}>
                {orderStatus.map((status) => {
                  return (
                    <option
                      value={status}
                      selected={status === order.status ? true : false}
                    >
                      {status.toUpperCase()}
                    </option>
                  );
                })}
              </select>
              <Button
                className="doneButton"
                onClick={() => handleClick(order.id)}
              >
                <DoneIcon className="done"></DoneIcon>
              </Button>
              <div className="OrderTable__Text">{order.userId}</div>
              <div className="OrderTable__Text">
                {sliceTime(order.updatedAt)}
              </div>
              <div className="OrderTable__Text">
                {' '}
                <button
                  onClick={() => {
                    hide(order.id);
                  }}
                >
                  D
                </button>
              </div>
            </li>
            <OrderDetail
              id={order.id}
              userId={order.userId}
              data={order.orderLines}
              edit={order.status === 'pending'}
            ></OrderDetail>
          </>
        ) : null;
      });
    content.push(
      <div className="Catalogue__Pagination">
        <Pagination
          onChange={handleClickPagination}
          count={Math.ceil(orderTable.length / cantidadAMostrar)}
          variant="outlined"
          shape="rounded"
        />
      </div>
    );
  } else if (status === 'failed') {
    content = (
      <>
        <h3>Ha ocurrido un error</h3>
        <Button onClick={handleRetry}>Reintentar</Button>
      </>
    );
  }
  return (
    <div className="OrderTable__Container">
      <li key={orderTable.id} className="OrderTable__li">
        <div className="OrderTable__index">ID</div>
        <div className="OrderTable__index">Total</div>
        <div className="OrderTable__index">Status</div>
        <div className="OrderTable__index">User Id</div>
        <div className="OrderTable__index">Fecha</div>
        <div className="OrderTable__index">Detalle</div>
      </li>
      {content}
    </div>
  );
}

function hide(id) {
  //*funcion para mostrar||ocultar el detalle de la orden
  let OrderDetail = document.getElementById(id).style.display;
  if (OrderDetail !== 'inline') {
    document.getElementById(id).style.display = 'inline';
  } else {
    document.getElementById(id).style.display = 'none';
  }
}

export default OrderTable;
