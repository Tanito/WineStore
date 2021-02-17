import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Container, Button } from '@material-ui/core';
import FormField from '../../FormComponents/FormField';
import '../LoadProduct/LoadProduct.modules.css';
import { formatArrayToOption } from '../../utils';
import { Formik, Form } from 'formik';
import {
  allStrainsSelector,
  strainsStatusSelector
} from '../../../selectors';
import { deleteStrain } from '../../../slices/strainSlice';

function DeleteStrain() {
  const dispatch = useDispatch();
  const allStrains = useSelector(allStrainsSelector);
  const strainsStatus = useSelector(strainsStatusSelector);

  const initialValues = {
    strainToDelete: '',
  };

  const [strainOption, setStrainOption] = useState([]);
  let content;

  useEffect(() => {
    if (strainsStatus === 'succeded') {
      setStrainOption(formatArrayToOption(allStrains, 'name'));
    }
  }, [strainsStatus, dispatch, allStrains]);

  const handleSubmit = (values, onSubmitProps) => {
    const strainId = values.strainToDelete;
    dispatch(deleteStrain({ strainId, formik: onSubmitProps }));
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
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Container>
            <Form>
              <FormField
                fieldType="select"
                label="Listado de cepas"
                name="strainToDelete"
                options={strainOption}
                required
              />
              <br></br>
              <Container>
                <Button variant="contained" color="primary" type="submit">
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

export default DeleteStrain;
