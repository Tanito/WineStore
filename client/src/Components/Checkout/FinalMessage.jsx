import React from 'react';
import { Typography } from '@material-ui/core';
function FinalMessage({ myCart }) {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Muchas gracias por su compra!
      </Typography>
      <Typography variant="subtitle1">
        Su número de orden es {myCart}
      </Typography>
    </React.Fragment>
  );
}

export default FinalMessage;
