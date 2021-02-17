import React from 'react';
import './Contenido.modules.css';

function Contenido() {
  return (
    <div id="contenido">
      <img
        className="imgLogo"
        src="https://i.ibb.co/x7Z2cfF/winestorelogo.png"
        alt="Logo"
      ></img>
      <div id="contenedor1">
        {/* Los article es necesario para poder armar el efecto de la carta que gira */}
        <article key="1" className="card">
          <img
            className="card__front"
            id="visionImg"
            src="https://i.ibb.co/qMdksps/Vision.png"
            alt="Visión"
          ></img>
          <div className="card__back">
            <h3>Nuestra Vision</h3>
            <p>Seguir siendo un opción segura y de confianza para nuestros clientes en un 
              mercado atomizado con infinidad de marcas</p>
          </div>
        </article>
        <article key="2" className="card">
          <img
            className="card__front"
            id="visionImg"
            src="https://i.ibb.co/mBGfr4L/mision.png"
            alt="Misión"
          ></img>
          <div className="card__back">
            <h3>Nuestra Mision</h3>
            <p>Entender las necesidades actuales y futuras de nuestros clientes, 
              esforzándonos permanentemente por cumplir y superar lealmente sus expectativas</p>
          </div>
        </article>
        <article key="3" className="card">
          <img
            className="card__front"
            id="visionImg"
            src="https://i.ibb.co/882fSvc/valores.png"
            alt="Valores"
          ></img>
          <div className="card__back">
            <h3>Nuestros Valores</h3>
            <p>Trabajo en equipo</p>
            <p>Entusiasmo</p>
            <p>Compromiso</p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default Contenido;
