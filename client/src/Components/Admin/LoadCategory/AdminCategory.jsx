import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container } from '@material-ui/core';
import { allCategoriesStatusSelector } from '../../../selectors/index';
import { getAllCategories } from '../../../slices/categorySlice';
import DeleteCategory from './Category/DeleteCategory';
import LoadCategory from './Category/LoadCategory';

function AdminCategory() {
  const dispatch = useDispatch();
  const allCatStatus = useSelector(allCategoriesStatusSelector);

  const [borrar, setBorrar] = useState(false);

  useEffect(() => {
    if (allCatStatus === 'idle') {
      dispatch(getAllCategories());
    }
  }, [allCatStatus, dispatch]);

  return (
    <Container className="">
      {borrar ? <h1>Borrar una categoría</h1> : <h1>Cargar una categoría</h1>}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setBorrar(!borrar);
        }}
      >
        {borrar ? 'CARGAR' : 'BORRAR'}
      </Button>
      <hr></hr>
      <Container>{borrar ? <DeleteCategory /> : <LoadCategory />}</Container>
    </Container>
  );
}

export default AdminCategory;
