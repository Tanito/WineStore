import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import './Products.modules.css';
import { getAllProducts } from '../../../slices/productSlice';
import {
  allProductsSelector,
  allProductsStatusSelector,
} from '../../../selectors';
// import LoadProduct from '../LoadProduct/LoadProduct';

import EditIcon from '@material-ui/icons/Edit';
import { CircularProgress, Button } from '@material-ui/core';

// Esta tabla es para el admin.
// Tiene que mostrar todos los productos.

function Products() {
  const dispatch = useDispatch();
  const history = useHistory();
  const products = useSelector(allProductsSelector);
  const status = useSelector(allProductsStatusSelector);

  const [value, setValue] = useState(0); // Rating traer promedio de calificación de base de datos según producto
  const [page, setPage] = useState(1);
  const cantidadAMostrar = 5;
  function handleClick(e, num) {
    setPage(num);
  }

  let content;

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleRetry = () => {
    //func para reintentar y forzar refresh
    window.location.reload();
    return false;
  };

  const editHandler = (id) => {
    history.push({
      pathname: `/admin/edit/${id}`,
      state: {
        edit: true,
      },
    });
  };

  if (status === 'loading') {
    content = (
      <>
        <h2>Cargando...</h2>
        <CircularProgress />
      </>
    );
  } else if (status === 'succeded') {
    content = products.slice((page - 1) * cantidadAMostrar, page * cantidadAMostrar).map((product, idx) => {
      let even = idx % 2 === 0 ? 'white' : 'beige';
      return (
        <>
          <div className="grid-item" style={{ backgroundColor: even }}>
            {product.id}
          </div>
          <div className="grid-item" style={{ backgroundColor: even }}>
            {product.name}
          </div>
          <Button
            className="editButton"
            style={{ backgroundColor: even }}
            onClick={() => editHandler(product.id)}
          >
            <EditIcon className="grid-item"></EditIcon>
          </Button>
        </>
      );
    });
    content.push(<div className="Catalogue__Pagination"><Pagination onChange={handleClick} count={Math.ceil(products.length / cantidadAMostrar)} variant="outlined" shape="rounded" /></div>);
  } else if (status === 'failed') {
    content = (
      <>
        <h3>Ha ocurrido un error</h3>
        <Button onClick={handleRetry}>Reintentar</Button>
      </>
    );
  }
  return (
    <div>
      <Button id="btnCargar" onClick={() =>
 
        history.push({
          pathname: '/dashboard/loadproduct',
          state: {
            edit: false,
          }
        })
      }
      > CARGAR PRODUCTO </Button>

      <div class="grid-container">

        <p className="grid-item" style={{ fontWeight: 'bold' }}>
          Código
      </p>
        <p className="grid-item" style={{ fontWeight: 'bold' }}>
          Producto
      </p>
        <p className="grid-item" style={{ fontWeight: 'bold' }}>
          Editar/Borrar
      </p>
        {content}
      </div >
    </div>
  );
}

export default Products;
