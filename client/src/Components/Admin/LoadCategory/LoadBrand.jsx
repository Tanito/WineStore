import React, { Component } from 'react';
import FormField from '../../FormComponents/FormField';
import { Formik, Form } from 'formik';
import { validationSchemaLoadBrands } from '../adminValidations.js';
import { Container, Paper, Button } from '@material-ui/core';
import '../LoadProduct/LoadProduct.modules.css';
import axios from 'axios';

export const LoadProduct = () => {
  const initialValues = {
    name: '',
    description: '',
    pairing: '',
    origin: '',
  };

  const postNewBrand = async (brand) => {
    try {
      const resp = await axios.post(
        'http://localhost:3000/products/brand',
        brand
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = (values, onSubmitProps) => {
    postNewBrand(values);
    // onSubmitProps.resetForm();
  };

  return (
    <Container className="">
      <h1>Carga de marcas</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemaLoadBrands}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Container>
            <Form>
              <FormField
                fieldType="input"
                label="Nombre de la marca"
                name="name"
                required
              />
              <FormField
                fieldType="textarea"
                label="Historia de la marca"
                name="history"
                rows={8}
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
    </Container>
  );
};

export default LoadProduct;
