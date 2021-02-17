import React, { useEffect, useState } from 'react';
import { Container, Button } from '@material-ui/core';
import '../LoadProduct/LoadProduct.modules.css';
import { useSelector, useDispatch } from 'react-redux';
import { strainsStatusSelector } from '../../../selectors';
import DeleteStrain from '../Strain/DeleteStrain.jsx';
import LoadStrain from '../Strain/LoadStrain.jsx';
import { getAllStrains } from '../../../slices/strainSlice';

export const AdminStrain = () => {
  const dispatch = useDispatch();
  const strainsStatus = useSelector(strainsStatusSelector);

  const [borrar, setBorrar] = useState(false);

  useEffect(() => {
    if (strainsStatus === 'idle') {
      dispatch(getAllStrains());
    }
  }, [strainsStatus, dispatch]);

  return (
    <Container className="">
      {borrar ? <h1>Borrar cepas</h1> : <h1>Carga de cepas</h1>}
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
      <Container>{borrar ? <DeleteStrain /> : <LoadStrain />}</Container>
    </Container>
  );
};

export default AdminStrain;
