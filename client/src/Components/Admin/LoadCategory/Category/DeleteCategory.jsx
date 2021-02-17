import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Container, Button } from '@material-ui/core';
import { Formik, Form } from 'formik';
import { formatArrayToOption } from '../../../utils';
import FormField from '../../../FormComponents/FormField';
import {
  allCategoriesStatusSelector,
  allCategoriesSelector,
} from '../../../../selectors';
import { deleteCategory } from '../../../../slices/categorySlice';

function DeleteCategory() {
  const dispatch = useDispatch();
  const allCatStatus = useSelector(allCategoriesStatusSelector);
  const allCats = useSelector(allCategoriesSelector);

  const initialValues = {
    tasteToDelete: '',
  };

  const [categoryOption, setCategoryOption] = useState([]);

  let content;

  useEffect(() => {
    if (allCatStatus === 'succeded') {
      setCategoryOption(formatArrayToOption(allCats, 'taste'));
    }
  }, [allCatStatus, dispatch, allCats]);

  const handleSubmit = (values, onSubmitProps) => {
    const categoryId = values.tasteToDelete;
    dispatch(deleteCategory({ categoryId, formik: onSubmitProps }));
  };

  if (allCatStatus === 'loading') {
    //* si loading renderizamos `Cargando...`
    content = (
      <>
        <h2>Cargando....</h2>
        <CircularProgress />
      </>
    );
  } else if (allCatStatus === 'succeded') {
    //* Si success renderizamos un dropdown con todas las categorias
    content = (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Container>
            <Form>
              <FormField
                fieldType="select"
                label="Listado de categorías"
                name="tasteToDelete"
                options={categoryOption}
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
                  Borrar
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

export default DeleteCategory;
