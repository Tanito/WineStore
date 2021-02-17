import React from 'react';
import { Button, Container } from '@material-ui/core';
import { userSelector } from '../../../selectors';
import { useSelector } from 'react-redux';
import { useAuthContext } from '../../ProtectRoute/authContext';

function CartItem(props) {
  const authStatus = useAuthContext();
  const user = useSelector(userSelector);
  const { id, image, name, price, quantity, stock } = props.prod;
  const {
    deleteItemHandler,
    incrementHandler,
    decrementHandler,
  } = props.handlers;

  return (
    <Container>
      <li className="productCart">
        <div>
          <img
            className="imageProductCart"
            src={image}
            alt="Producto sin imagen"
          />
        </div>
        <div className="infoProduct">
          <div>
            <p>{name}</p>
            <p>$ {price}</p>
          </div>
          <div className="quantity">
            <a href="#" className="Cart__DeleteProduct">
              <i
                class="fas fa-trash-alt"
                onClick={
                  authStatus
                    ? (e) => deleteItemHandler({ id, userId: user.id, name })
                    : (e) => deleteItemHandler({ id, name })
                }
              ></i>
            </a>
            <Button
              name={id}
              className="button"
              onClick={(e) => decrementHandler(e, props.prod)}
            >
              -
            </Button>
            <input className="input" id={id} value={quantity}></input>
            <Button
              name={id}
              className="button"
              onClick={(e) => incrementHandler(e, props.prod)}
            >
              +
            </Button>
          </div>
        </div>
      </li>
    </Container>
  );
}

export default CartItem;
