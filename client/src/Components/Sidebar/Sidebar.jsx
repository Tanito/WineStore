import React, { useEffect, useState } from 'react';
import './Sidebar.modules.css';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllProducts,
  productPriceLess,
  productPriceMore,
  productPriceBetween,
} from '../../slices/productSlice';
import {
  getAllCategories,
  getAllProdsByCategory,
  productPriceLessCategory, productPriceBetweenCategory, productPriceMoreCategory
} from '../../slices/categorySlice';
import {
  allProductsSelector,
  allCategoriesStatusSelector,
  allCategoriesSelector,
} from '../../selectors';
import { CircularProgress, Button } from '@material-ui/core';

function Sidebar(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const allProducts = useSelector(allProductsSelector);
  const allCategories = useSelector(allCategoriesSelector);
  const allCatsStatus = useSelector(allCategoriesStatusSelector);

  useEffect(() => {
    if (allCatsStatus === 'idle') dispatch(getAllCategories());
  }, [allCatsStatus, dispatch]);

  const categoryClickHandler = (e) => {
    let taste = e.target.name.toLowerCase();
    history.push(`/catalogue/${taste}`);
    dispatch(getAllProdsByCategory(taste));
  };

  const priceLessHandler = (e, f, g) => {
    if(!props.taste) {

      props.pagina(1)
      dispatch(getAllProducts()).then(() => {
        dispatch(productPriceLess(e))
      });
    }else{

      dispatch(productPriceLessCategory(e))
      props.pagina(1)

    }
  };
  const priceBetweenHandler = (e, f, g) => {
    if(!props.taste){

      props.pagina(1);
      dispatch(getAllProducts()).then(() => {
        dispatch(productPriceBetween({ e, f }));
      })
    }else{
      props.pagina(1);
      dispatch(productPriceBetweenCategory({ e, f }));
    }
  };
  const priceMoreHandler = (e) => {
    if(!props.taste){

      props.pagina(1);
      dispatch(getAllProducts()).then(() => {
        dispatch(productPriceMore(e));
      });
    }else{
      props.pagina(1);
      dispatch(productPriceMoreCategory( e));

    }
  };

  let content;
  if (allCatsStatus === 'loading') {
    content = (
      <>
        <p>Cargando sabores...</p>
        <CircularProgress />
      </>
    );
    return content;
  } else if (allCatsStatus === 'succeded') {
    if (allCategories.length < 1) {
      content = <p>No hay sabores cargados</p>;
      return content;
    }
    content = allCategories.map((category, idx) => {
      return (
        <Button
          variant="text"
          className="Sidebar__Text"
          key={idx}
          name={category.taste}
          onClick={(e) => categoryClickHandler(e)}
        >
          {category.taste}
        </Button>
      );
    });
  }
  return (
    <div className="Sidebar__container">
      <div className="Sidebar__lista">
        <Button
          variant="text"
          className=""
          id="verTodos"
          onClick={() => {
            history.push(`/catalogue`);
            dispatch(getAllProducts());
          }}
        >
          {' '}
          Ver Todos
        </Button>
        {allProducts.length > 0 ? (
          <>
            <p className="Sidebar__CategoryName">Precio</p>
            <Button
              className="Sidebar__Text"
              onClick={() => priceLessHandler(350)}
            >
              Hasta $350
            </Button>
            <Button
              className="Sidebar__Text"
              onClick={() => priceBetweenHandler(350, 600)}
            >
              $350 a $600
            </Button>
            <Button
              className="Sidebar__Text"
              onClick={() => priceMoreHandler(600)}
            >
              Más de $600
            </Button>
            <p className="Sidebar__CategoryName">Sabores</p>
          </>
        ) : null}{' '}
        {content}
      </div>
    </div>
  );
}
export default Sidebar;
