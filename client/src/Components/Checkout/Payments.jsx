import React from "react";
import { Paper, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { myCartSelector, allProductsCartSelector } from "../../selectors";
import "./Payments.modules.css";

export default function Payments() {
  const history = useHistory();
  const orderDetails = useSelector(allProductsCartSelector);
  const orderId = useSelector(myCartSelector);

  const handleOnClick = (e) => {
    e.target.name === "checkout"
      ? history.push("/checkout")
      : axios
          .post("http://localhost:3000/mercadopago", { orderDetails, orderId })
          .then((payload) => {
            window.location.replace(payload.data.init_point);
          })
          .catch((err) => console.error(err));
  };

    return (
      <Paper className="pagos">
        <h3>Seleccione el método de pago</h3>
        <Button
          name="checkout"
          className="debitoCredito"
          button
          onClick={handleOnClick}
        >
          <img
            src="https://i.ibb.co/B411p8r/ndice.jpg"
            alt="otrosMedios"
          />
        </Button>
        <Button
          name="mercadopago"
          className="mercadoPago"
          button
          onClick={handleOnClick}
        >
          <img
            src="https://i.ibb.co/ZG4Kf5c/Mercado-Pago.jpg"
            alt="mercadoPago"
          />
        </Button>
      </Paper>
    );
}
