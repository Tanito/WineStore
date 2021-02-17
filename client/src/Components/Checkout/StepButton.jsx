import React from 'react';
import { checkoutStyles } from './checkoutHelpers';
import { Button } from '@material-ui/core';

function StepButton({ step, formik }) {
  const classes = checkoutStyles();
  const { isSubmitting } = formik;

  switch (step) {
    case 0:
      return (
        <Button
          disabled={isSubmitting}
          id="button"
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          Siguiente
        </Button>
      );
    case 1:
      return (
        <Button
          disabled={isSubmitting}
          id="button"
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          Siguiente
        </Button>
      );
    case 2:
      return (
        <Button
          disabled={isSubmitting}
          id="button"
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          Comprar
        </Button>
      );
    default:
      return <></>;
  }
}

export default StepButton;
