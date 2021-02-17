import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stepper,
  Step,
  makeStyles,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import StepButton from './StepButton';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { useDispatch, useSelector } from 'react-redux';
import {
  allProductsCartSelector,
  userSelector,
  myCartSelector,
  allOrderStatusSelector,
} from '../../selectors/index';
import {
  //modificateOrder,
  resetCart,
  postProductToCart,
} from '../../slices/productsCartSlice';
import {
  modificateOrder,
  confirmOrder,
  resetOrderstatus,
} from '../../slices/orderTableSlice';
import {
  deleteAddressInfo,
  deletePaymentInfo,
} from '../../Components/utils/index';
import { sendEmail } from '../../slices/userSlice';
import { total } from '../utils/index';
import axios from 'axios';
import {
  checkoutStyles,
  initialState_Checkout,
  checkoutValidationSchema,
} from './checkoutHelpers';
import { Formik, Form, useFormikContext } from 'formik';
import FinalMessage from './FinalMessage';
import { useHistory } from 'react-router-dom';

// Estilos de los "steps" del checkout

const steps = ['Direccion de envio', 'Detalles de pago', 'Verificar la orden'];

function getStepContent(step, formik, myCart) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm formik={formik} />;
    case 2:
      return <Review />;
    default:
      throw new Error('Paso incorrecto');
  }
}

export default function Checkout() {
  const classes = checkoutStyles();
  // const { values: formValues } = useFormikContext();

  const history = useHistory();

  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const myCart = useSelector(myCartSelector);
  const AllProductsCart = useSelector(allProductsCartSelector);
  const orderStatus = useSelector(allOrderStatusSelector);

  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = checkoutValidationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  let suma = Math.ceil((total(AllProductsCart) * 121) / 100);

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if (orderStatus === 'succeded') {
      setActiveStep((step) => step + 1);
      // formikContext.isSubmitting(false);
      dispatch(
        sendEmail({
          name: user.firstName,
          email: user.email,
          type: 'Order',
          orderCod: myCart,
        })
      );
      dispatch(resetCart());
      dispatch(resetOrderstatus());
    }
  }, [orderStatus]);

  useEffect(() => {
    if (AllProductsCart.length === 0) {
      history.push('/catalogue');
    }
  }, []);

  const handleSubmit = (values, formik) => {
    console.log('laststep', isLastStep);
    if (isLastStep) {
      realSubmit(values, formik);
    } else {
      setActiveStep((step) => step + 1);
      formik.setTouched({});
      formik.setSubmitting(false);
    }
  };
  const realSubmit = (values, formik) => {
    const order_payload = {
      myCart,
      total: suma,
      status: 'completed',
    };
    const cart_payload = AllProductsCart;
    const payload = { cart_payload, order_payload };
    dispatch(confirmOrder(payload));
    // dispatch(
    //   modificateOrder({
    //     myCart: myCart,
    //     total: suma,
    //     status: 'completed',
    //   })
    // );
    // AllProductsCart.map(async (p) => {
    //   //Actualiza stock en DB
    //   if (p.stock >= p.quantity)
    //     await axios.put(`http://localhost:3000/products/${p.id}`, {
    //       stock: p.stock - p.quantity,
    //     });
    // });
    // // deleteAddressInfo();
    // // deletePaymentInfo();
    // formik.isSubmitting(false);
    // setActiveStep((step) => step + 1);
    // dispatch(
    //   sendEmail({
    //     name: user.firstName,
    //     email: user.email,
    //     type: 'Order',
    //     orderCod: myCart,
    //   })
    // );
    // dispatch(resetCart());
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label, idx) => (
              <Step key={idx}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <FinalMessage myCart={myCart} />
            ) : (
              <React.Fragment>
                <Formik
                  initialValues={initialState_Checkout}
                  validationSchema={currentValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {(formik) => (
                    <Form>
                      {getStepContent(activeStep, formik)}
                      <div className={classes.buttons}>
                        {activeStep !== 0 && activeStep < steps.length && (
                          <Button
                            onClick={handleBack}
                            className={classes.button}
                            disabled={formik.isSubmitting}
                          >
                            Atras
                          </Button>
                        )}
                        <StepButton step={activeStep} formik={formik} />
                        {formik.isSubmitting && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
