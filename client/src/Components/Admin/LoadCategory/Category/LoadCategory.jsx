import React from 'react';
import { Formik, Form } from 'formik';
import { Container, Button, CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { postNewCategory } from '../../../../slices/categorySlice';
import {
  allCategoriesStatusSelector,
  allCategoriesErrorSelector
} from '../../../../selectors/index';
import { validationSchemaLoadCategories } from '../../../Admin/adminValidations';
import FormField from '../../../FormComponents/FormField';

function LoadCategory() {
  const dispatch = useDispatch();
  const allCatStatus = useSelector(allCategoriesStatusSelector);
  const allCatError = useSelector(allCategoriesErrorSelector);

  let content;

  const initialValues = {
    taste: '',
  };

  const handleSubmit = (values, onSubmitProps) => {
    dispatch(postNewCategory({ categoryName: values, formik: onSubmitProps }));
  };

  if (allCatStatus === 'loading') {
    content = (
      <>
        <h2>Cargando....</h2>
        <CircularProgress />
      </>
    );
  } else if (allCatStatus === 'succeded') {
    content = (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemaLoadCategories}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Container>
            <Form>
              <FormField
                fieldType="input"
                label="Nombre de categoría"
                name="taste"
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
                  {' '}
                  Cargar
                </Button>
              </Container>
            </Form>
          </Container>
        )}
      </Formik>
    );
  } else if (allCatStatus === 'failed') {
    content = (
      <>
        <h3>Error al cargar categoria</h3>
        {console.error(allCatError)}
        <p>{allCatError.name}</p>
        <p>{allCatError.message}</p>
        <Button>Reintentar</Button>
      </>
    );
  }

  return <>{content}</>;
}

export default LoadCategory;
