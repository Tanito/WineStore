import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress } from '@material-ui/core';
import './CatalogueByTaste.modules.css';

import Pagination from '@material-ui/lab/Pagination';

import ProductCard from '../ProductCard/ProductCard.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import { getAllProducts } from '../../slices/productSlice';
import {
  allProdsByCategoryStatusSelector,
  allProdsByCategoryErrorSelector,
  allProdsByCategorySelector,
  filteredTasteSelector,
} from '../../selectors';

function CatalogueByTaste() {
  const dispatch = useDispatch();
  const allProdsByCatStatus = useSelector(allProdsByCategoryStatusSelector);
  const allProdsByCat = useSelector(allProdsByCategorySelector);
  const allProdsByCatError = useSelector(allProdsByCategoryErrorSelector);
  const filteredTaste = useSelector(filteredTasteSelector);
  const [page, setPage] = useState(1);
  const cantidadAMostrar = 6;

  function handleClick(e, num) {
    setPage(num);
  }


  useEffect(()=>{
    dispatch(getAllProducts())
  }, [dispatch])

  let content;

  if (allProdsByCatStatus === 'loading') {
    content = (
      <>
            <Sidebar></Sidebar>
      <div className='CatalogueByTaste__containerCargando'>

        <h3 className='CatalogueByTaste__text'>Cargando...</h3>
        <CircularProgress />
      </div>
      </>
    );
    return content;
  } else if (allProdsByCatStatus === 'succeded') {
    if (allProdsByCat.length < 1) {
      content = <h3>No hay productos</h3>;
    } else {
      content = allProdsByCat.slice((page-1)*cantidadAMostrar, page*cantidadAMostrar).map((product, idx) => (
        <ProductCard data={product} key={idx} />
      ));
      content.push(<div className="CatalogueByTaste__Pagination"><Pagination onChange={handleClick} count={allProdsByCat.length/cantidadAMostrar} variant="outlined" shape="rounded" /></div>);
    }
  } else if (allProdsByCatStatus === 'failed') {
    return (
      <>
        <h3>Error al cargar productos</h3>
        {console.error(allProdsByCatError)}
        <p>{allProdsByCatError.name}</p>
        <p>{allProdsByCatError.message}</p>
        <Button>Try Again</Button>
      </>
    );
  }
  return (
    <div className="CatalogueByTaste__container">
    <Sidebar pagina={setPage} taste={true}></Sidebar>
    <h2>Viendo vinos de sabor: {filteredTaste}</h2>
      <div className="CatalogueByTaste__Div">{content}</div>
    </div>
  );
}

export default CatalogueByTaste;
