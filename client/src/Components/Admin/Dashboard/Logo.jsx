import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <h1>PANEL DE ADMINISTRADOR</h1>
      <img
            className="imgAdmin"
            src="https://i.ibb.co/JKQk16V/racimo-de-uvas.png"
            alt="No se puede cargar la imagen"
          />
    </React.Fragment>
  );
}