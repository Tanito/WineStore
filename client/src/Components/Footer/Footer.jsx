import React from 'react';
import './Footer.modules.css';

function Footer() {
  return (
    <div className="footer">
      <div className="logoContainer">
        <img
          className="logoFooter"
          src="https://i.ibb.co/ZgYc39Z/barricalogo.png"
          alt="Barrica"
        ></img>
      </div>
      <div className="rrssContainer">
        <div className="rrssImgContainer">
          <a href="http://facebook.com" className="red__instagram">
            <i className="fab fa-facebook-f"></i>
          </a>
        </div>
        <div className="rrssImgContainer">
          <a href="http://instagram.com" className="red__instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="rrssImgContainer">
          <a href="http://twitter.com" className="red__instagram">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
