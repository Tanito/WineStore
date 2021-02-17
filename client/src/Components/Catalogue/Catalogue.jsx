import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress } from '@material-ui/core';
import './Catalogue.modules.css';
import Pagination from '@material-ui/lab/Pagination';

import ProductCard from '../ProductCard/ProductCard.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import { getAllProducts } from '../../slices/productSlice';
import {
  allProductsSelector,
  allProductsStatusSelector,
  allProductsErrorSelector,
} from '../../selectors';

function Catalogue() {
  const dispatch = useDispatch();
  const allProducts = useSelector(allProductsSelector);
  const allProdStatus = useSelector(allProductsStatusSelector);
  const allProdError = useSelector(allProductsErrorSelector);
  const [page, setPage] = useState(1);
  const cantidadAMostrar = 6;
  function handleClick(e, num) {
    setPage(num);
  }

  useEffect(() => {
    if (allProdStatus === 'idle') dispatch(getAllProducts());
  }, [allProdStatus, dispatch]);

  let content;

  if (allProdStatus === 'loading') {
    content = (
      <>
      <div className='Catalogue__containerCargando'>

        <h3>Cargando...</h3>
        <CircularProgress />
      </div>
      </>
    );
    return content;
  } else if (allProdStatus === 'succeded') {
    if (allProducts.length < 1) {
      content = (
        <>
          <h3>No hay productos</h3>
          <Button onClick={() => dispatch(getAllProducts())}>Reintentar</Button>
        </>
      );
    } else {
      content = allProducts.slice((page-1)*cantidadAMostrar, page*cantidadAMostrar).map((product, idx) => (
        <ProductCard data={product} key={idx} />
      ));
      content.push(<div className="Catalogue__Pagination"><Pagination onChange={handleClick} count={Math.ceil(allProducts.length/cantidadAMostrar)} variant="outlined" shape="rounded" /></div>);
    }
  } else if (allProdStatus === 'failed') {
    return (
      <>
        <h3>Error al cargar productos</h3>
        {console.error(allProdError)}
        <p>{allProdError.name}</p>
        <p>{allProdError.message}</p>
        <Button onCLick={() => dispatch(getAllProducts())}>Reintentar</Button>
      </>
    );
  }
  return (
    <div className="Catalogue__container">
      <Sidebar pagina={setPage} taste={false}></Sidebar>
      <h3>Viendo todos los vinos</h3>
      <div className="Catalogue__Div">{content}</div>
    </div>
  );
}

export default Catalogue;
