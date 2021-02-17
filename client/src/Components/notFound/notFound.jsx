import React from 'react';
import { Container, Button } from '@material-ui/core';
import './notFound.modules.css';
import { Link } from 'react-router-dom';

function notFound() {
  return (
    <Container className="notFound">
      <h1>Pagina no encontrada</h1>
      <img src="https://i.ibb.co/Jxv0WcQ/error-404-cork-removebg-preview.png" alt="Página no encontrada"></img>
      <Link to="/">
        <Button>Volver al inicio</Button>
      </Link>
    </Container>
  );
}

export default notFound;
