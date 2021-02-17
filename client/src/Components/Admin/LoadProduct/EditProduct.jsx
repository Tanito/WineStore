import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container } from '@material-ui/core';
import { Formik, Form } from 'formik';
import {
  allCategoriesStatusSelector,
  strainsStatusSelector,
  productDetailStatusSelector,
  wineDetailSelector,
  userSelector,
} from '../../../selectors';
import FormField from '../../FormComponents/FormField';
import { validationSchemaLoadProducts } from '../adminValidations';
import { deleteProduct, updateProduct } from '../../../slices/productSlice';
import userSlice from '../../../slices/userSlice';

function EditProduct(props) {
  const { strainOption, tasteOption } = props.options; //opciones para los dropdown
  const history = useHistory();
  const dispatch = useDispatch();

  const allCatStatus = useSelector(allCategoriesStatusSelector);
  const strainStatus = useSelector(strainsStatusSelector);
  const wineDetail = useSelector(wineDetailSelector);
  const wineDetailStatus = useSelector(productDetailStatusSelector);
  const user = useSelector(userSelector);

  let content;

  //? objeto con los valores vacio para limpiar el form, en caso de `reset`
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

  const handleSubmit = (values, formik) => {
    //*armamos el objeto `payload` levantado los datos del formulario, y ademas agregamos,
    //* emptyValues para resetear y el objeto `formik` con las funciones de formik
    const payload = {
      product: {
        id: wineDetail.wine.id,
        name: values.name,
        strain: values.strain,
        description: values.description,
        yearHarvest: values.yearHarvest,
        price: values.price,
        stock: values.stock,
        image: values.image,
        categories: [values.taste1, values.taste2, values.taste3],
      },
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      emptyValues,
      formik,
    };
    dispatch(updateProduct(payload));
  };
  const handleCatDelete = (e, formik) => {
    //* func para borrar una categoria seteamos el valor del campo =''
    //* el Back se encarga del resto
    let name = e.target.name;
    formik.setFieldValue(name, '');
  };

  const handleDelete = (formik) => {
    //* func para borrar producto, redirige a `catalogue` una vez borrado
    const id = wineDetail.wine.id;
    const payload = {
      id,
      formik,
    };
    dispatch(deleteProduct(payload));
    history.push('/catalogue');
  };

  const handleReset = (formik) => {
    //* func para resetear el form
    formik.resetForm({
      values: { ...emptyValues },
      errors: { ...emptyValues },
    });
  };

  const handleRetry = () => {
    //func que recarga la pagina
    // history.push(props.location.pathname);
    window.location.reload();
    return false;
  };

  if (
    allCatStatus === 'failed' ||
    strainStatus === 'failed' ||
    wineDetailStatus === 'failed'
  ) {
    //? en caso de error renderiza un mensaje y un boton de reintentar
    content = (
      <>
        <h3>Ha ocurrido un error</h3>
        <Button onClick={handleRetry}>Reintentar</Button>
      </>
    );
  } else if (
    allCatStatus === 'succeded' &&
    strainStatus === 'succeded' &&
    wineDetailStatus === 'succeded'
  ) {
    //* cuando todas las llamadas a la API son success armamos un objeto con todos los valores de la DB
    //* este objeto lo pasamos como valores iniciales al form
    const editValues = {
      name: wineDetail.wine.name,
      strain: wineDetail.wine.strainId,
      description: wineDetail.wine.description,
      yearHarvest: wineDetail.wine.yearHarvest,
      price: wineDetail.wine.price,
      stock: wineDetail.wine.stock,
      image: wineDetail.wine.image,
      taste1: !!wineDetail.categories[0] ? wineDetail.categories[0].id : '',
      taste2: !!wineDetail.categories[1] ? wineDetail.categories[1].id : '',
      taste3: !!wineDetail.categories[2] ? wineDetail.categories[2].id : '',
    };
    content = (
      <Formik
        initialValues={editValues}
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
                // value={editValues.strain}
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
                placeholder="ninguna"
                fieldType="select"
                label="Sabor 1"
                name="taste1"
                options={tasteOption}
                id="delete1"
                // value={editValues.taste1}
              />
              <Button
                variant="outlined"
                color="primary"
                label="Eliminar"
                name="taste1"
                onClick={(e) => handleCatDelete(e, formik)}
              >
                X
              </Button>
              <FormField
                placeholder="ninguna"
                fieldType="select"
                label="Sabor 2"
                name="taste2"
                options={tasteOption}
                id="delete2"
                // value={editValues.taste2}
              />
              <Button
                variant="outlined"
                color="primary"
                label="Eliminar"
                name="taste2"
                onClick={(e) => handleCatDelete(e, formik)}
              >
                X
              </Button>
              <FormField
                placeholder="ninguna"
                fieldType="select"
                label="Sabor 3"
                name="taste3"
                options={tasteOption}
                id="delete3"
                // value={editValues.taste3}
              />
              <Button
                variant="outlined"
                color="primary"
                label="Eliminar"
                name="taste3"
                onClick={(e) => handleCatDelete(e, formik)}
              >
                X
              </Button>
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
                  Actualizar
                </Button>{' '}
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!formik.isValid}
                  onClick={(e) => handleDelete(formik)}
                >
                  DELETE
                </Button>
                <br></br>
                <Button
                  variant="outlined"
                  color="secondary"
                  disabled={formik.isSubmitting}
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

export default EditProduct;
