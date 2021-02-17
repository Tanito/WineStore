import React from 'react';
import { Container, Button } from '@material-ui/core';
import { Formik, Form } from 'formik';
import { validationSchemaLoadProducts } from '../adminValidations';
import { useSelector, useDispatch } from 'react-redux';
import {
  strainsStatusSelector,
  allCategoriesStatusSelector,
  allStrainsSelector,
  allCategoriesSelector,
} from '../../../selectors';
import FormField from '../../FormComponents/FormField';
import { postNewProduct } from '../../../slices/productSlice';

function LoadProduct(props) {
  const tasteOption = useSelector(allCategoriesSelector);
  const strainOption = useSelector(allStrainsSelector);
  const dispatch = useDispatch();

  //*valores iniciales del form
  const emptyValues = {
    name: '',
    strain: '',
    yearHarvest: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    taste1: '',
    taste2: '',
    taste3: '',
  };

  const allCatStatus = useSelector(allCategoriesStatusSelector);
  const strainStatus = useSelector(strainsStatusSelector);

  let content;

  const handleSubmit = (values, formik) => {
    //*armamos el objeto `payload` levantado los datos del formulario, y ademas agregamos,
    //* el objeto `formik` con las funciones de formik
    const payload = {
      product: {
        name: values.name,
        strain: values.strain,
        description: values.description,
        yearHarvest: values.yearHarvest,
        price: values.price,
        stock: values.stock,
        image: values.image,
        categories: [values.taste1, values.taste2, values.taste3],
      },
      formik,
    };
    dispatch(postNewProduct(payload));
  };

  const handleReset = (formik) => {
    //func para resetear el form
    formik.resetForm({
      values: { ...emptyValues },
      errors: { ...emptyValues },
    });
  };
  const handleRetry = () => {
    //func para reintentar y forzar refresh
    // history.push(props.location.pathname);
    window.location.reload();
    return false;
  };
  if (allCatStatus === 'failed' || strainStatus === 'failed') {
    content = (
      <>
        <h3>Ha ocurrido un error</h3>
        <Button onClick={handleRetry}>Reintentar</Button>
      </>
    );
  } else if (allCatStatus === 'succeded' && strainStatus === 'succeded') {
    content = (
      <Formik
        initialValues={emptyValues}
        validationSchema={validationSchemaLoadProducts}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Container>
            <Form>
              <FormField fieldType="input" label="Marca" name="name" required />
              <FormField
                fieldType="select"
                label="Cepa"
                name="strain"
                options={strainOption}
              />
              <FormField
                fieldType="input"
                type="number"
                label="Año de cosecha"
                name="yearHarvest"
                required
              />
              <FormField
                fieldType="input"
                type="number"
                label="Stock Inicial"
                name="stock"
              />
              <FormField
                fieldType="input"
                type="number"
                label="Precio"
                name="price"
                required
              />
              <FormField
                fieldType="input"
                label="URL de imagen"
                name="image"
                required
              />
              <FormField
                fieldType="select"
                label="Sabor 1"
                name="taste1"
                options={tasteOption}
              />
              <FormField
                fieldType="select"
                label="Sabor 2"
                name="taste2"
                options={tasteOption}
              />
              <FormField
                fieldType="select"
                label="Sabor 3"
                name="taste3"
                options={tasteOption}
              />
              <FormField
                fieldType="textarea"
                label="Descripcion del producto"
                name="description"
                rows={8}
                required
              />
              <br></br>
              <Container>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!formik.isValid}
                  type="submit"
                >
                  CARGAR
                </Button>
                <br></br>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleReset(formik)}
                  type="reset"
                >
                  RESET
                </Button>
              </Container>
            </Form>
          </Container>
        )}
      </Formik>
    );
  }

  return <Container>{content}</Container>;
}

export default LoadProduct;
