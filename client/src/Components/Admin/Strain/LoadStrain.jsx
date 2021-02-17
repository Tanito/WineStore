import React, { useEffect, useState } from 'react';
import FormField from '../../FormComponents/FormField';
import { Formik, Form } from 'formik';
import { validationSchemaLoadStrains } from '../adminValidations';
import { Container, Button, CircularProgress } from '@material-ui/core';
import '../LoadProduct/LoadProduct.modules.css';
import { useSelector, useDispatch } from 'react-redux';
import { formatArrayToOption } from '../../utils';
import {
  allStrainsSelector,
  strainsStatusSelector,
  strainsErrorSelector,
} from '../../../selectors';
import { postNewStrain } from '../../../slices/strainSlice';

export const LoadStrain = (props) => {
  const dispatch = useDispatch();
  const allStrains = useSelector(allStrainsSelector);
  const strainsStatus = useSelector(strainsStatusSelector);
  const strainsError = useSelector(strainsErrorSelector);

  let content;

  const initialValues = {
    name: '',
    description: '',
    pairing: '',
    origin: '',
  };

  const [strainOption, setStrainOption] = useState([]);

  useEffect(() => {
    // if (strainsStatus === 'idle') {
    //   dispatch(getAllStrains());
    // }
    setStrainOption(formatArrayToOption(allStrains, 'name'));
  }, [/*strainsStatus,*/ dispatch, allStrains]);

  const handleSubmit = (values, onSubmitProps) => {
    dispatch(postNewStrain({ newStrain: values, formik: onSubmitProps }));
  };

  if (strainsStatus === 'loading') {
    content = (
      <>
        <h2>Cargando....</h2>
        <CircularProgress />
      </>
    );
  } else if (strainsStatus === 'succeded') {
    content = (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemaLoadStrains}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Container>
            <Form>
              <FormField
                fieldType="input"
                label="Nombre de cepa"
                name="name"
                required
              />
              <FormField
                fieldType="textarea"
                label="Maridaje"
                name="pairing"
                rows={4}
                required
              />
              <FormField
                fieldType="textarea"
                label="Descripcion de la cepa"
                name="description"
                rows={6}
                required
              />
              <FormField
                fieldType="input"
                label="Origen de la cepa"
                name="origin"
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
  } else if (strainsStatus === 'failed') {
    content = (
      <>
        <h3>Error al cargar productos</h3>
        {console.error(strainsError)}
        <p>{strainsError.name}</p>
        <p>{strainsError.message}</p>
        <Button>Reintentar</Button>
      </>
    );
  }

  return <>{content}</>;
};
export default LoadStrain;
