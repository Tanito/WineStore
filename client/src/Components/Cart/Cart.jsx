import React, { useEffect, useState } from 'react';
import './Cart.modules.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  allProductsCartSelector,
  allProductsCartSyncSelector,
  allProductsCartStatusSelector,
  allOrderStatusSelector,
  userStatusSelector,
  userSelector,
  myCartSelector,
} from '../../selectors';
import {
  getAllProductsCart,
  sync,
  cartGuest,
  postProductToCart,
  modificateOrder,
  deleteAllProductsFromCart,
  deleteSingleProdFromCart,
  resetState,
} from '../../slices/productsCartSlice';
import CartItem from './CartItem/CartItem';
import {
  total,
  isLogged,
  functionCartGuest,
  deleteAddressInfo,
  deletePaymentInfo,
} from '../../Components/utils/index.js';
import axios from 'axios';
import { useAuthContext } from '../ProtectRoute/authContext';

function Cart() {
  const dispatch = useDispatch();
  const history = useHistory();
  const AllProductsCart = useSelector(allProductsCartSelector); // tiene los prods del cart
  const sincronizar = useSelector(allProductsCartSyncSelector);
  const cartStatus = useSelector(allProductsCartStatusSelector);
  const user = useSelector(userSelector);
  const myCart = useSelector(myCartSelector);
  const statusUser = useSelector(userStatusSelector);
  const statusOrder = useSelector(allOrderStatusSelector);
  const [subTotal, setSubTotal] = useState(0);
  // const [login, setLogin] = useState(false);
  // let logged = isLogged();
  const authStatus = useAuthContext();

  const handleDelete = () => {
    if (authStatus) {
      dispatch(deleteAllProductsFromCart({ userId: user.id }));
      dispatch(sync(false));
    }
    if (!authStatus) {
      let storage = [];
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(storage));
      dispatch(sync(false));
    }
  };

  // Mismo proceso que con el increment, pero a diferencia de tener en cuenta el stock ahora reviza
  // que la cantidad nunca sea inferior a 1, el increment esta en false, por lo que en la BD y en el
  // store se procede a reducir la cantidad, siempre comprobando que sea >= a 1

  const decrementHandler = (event, detail) => {
    if (authStatus) {
      let id = event.target.name * 1;
      const payload = {
        // orderline que se envia por post
        id: detail.id,
        price: detail.price,
        quantity: detail.quantity,
        detail,
        userId: user.id,
        orderId: detail.orderId,
        increment: false, // cuando true aumenta la cantidad
      }; // en BD y en el store
      if (detail.quantity > 1) {
        let valueInput = document.getElementById(id).value; // cantidad de productos a comprar
        if (valueInput > 1) {
          dispatch(postProductToCart(payload)); // action con post a la db
        } // productCartSlice
      }
    }

    if (!authStatus) {
      //funciona pero no renderiza.
      let id = event.target.name * 1;
      const payload = {
        name: detail.name,
        id: detail.id,
        price: detail.price,
        quantity: detail.quantity,
        orderId: detail.orderId,
        //  userId: user.id,
      };
      if (detail.quantity > 1) {
        dispatch(sync(false));
        let valueInput = document.getElementById(id).value;
        if (valueInput > 1) {
          functionCartGuest(payload, true);
        }
      }
    }
  };

  // incrementHandler: al hacer click en el boton de + en el carro se dispara un event en el Item del
  // carrito el cual lleva consigo la id del item el cual queremos aumentar, y se nos pasa por props,
  // el precio del item, la cantidad y el stock. Con la id del item buscamos su valor del numero que
  // esta representando la cantidad de productos, el cual guardamos para mayor orden y endentimiento,
  // ademas creamos un obj payload que hace de orderLine creado con los valores que tienen las props.
  // Hecho esto, se compara el valor guardado antes con el stock, si el numero de productos supera o
  // iguala el stock, entonces no aumenta el numero, ignorando la accion.
  // Si hay stock suficiente entonces se envia una accion en el cual se envia un post para actualizar
  // la cantidad de items a comprar de ese producto en el carrito de la BD, para eso se utiliza el
  // increment en el payload, si es true aumenta la cantidad, false, reduce, luego con lo que regresa
  // de el post, en la accion se actualiza el estado, buscamos si el producto que se posteo en la BD
  // esta en el store y luego se hace lo mismo que en la ruta, cambiando la cantidad en el store y
  // cambiando la cantidad en el Imput del Item

  const incrementHandler = (event, detail) => {
    if (authStatus) {
      let id = event.target.name * 1;
      let valueInput = document.getElementById(id).value; // cantidad de productos a comprar
      const payload = {
        // orderline que se envia por post
        id: detail.id,
        price: detail.price,
        quantity: detail.quantity,
        detail,
        userId: user.id,
        increment: true, // cuando true aumenta la cantidad
      }; // en BD y en el store
      if (valueInput < detail.stock) {
        dispatch(postProductToCart(payload)); // action con post a la db
      } // productCartSlice
    }

    if (!authStatus) {
      let id = event.target.name * 1;
      let valueInput = document.getElementById(id).value;
      const payload = {
        id: detail.id,
        price: detail.price,
        quantity: detail.quantity,
        stock: detail.stock,
        name: detail.name,
      };
      if (valueInput < detail.stock) {
        functionCartGuest(payload);
        dispatch(sync(false));
      }
    }
  };

  const deleteItemHandler = ({ id, userId }) => {
    if (authStatus) {
      const payload = {
        productId: id, // id del producto a eliminar
        userId, // id del usuario para saber de que
      }; // carrito eliminar el prod
      dispatch(deleteSingleProdFromCart(payload));
    }
    if (!authStatus) {
      const payload = id;
      functionCartGuest(payload, null, true);
      dispatch(sync(false));
    }
  };

  const handleConfirm = () => {
    if (authStatus) {
      let total = Math.ceil((subTotal * 121) / 100);
        //history.push('/checkout');
        history.push('/payments');
    }
    if (!authStatus) {
      history.push('/form/user/login');
    }
    deleteAddressInfo();
    deletePaymentInfo();
    //agregar total para guardar
  };

  const handlers = {
    deleteItemHandler,
    incrementHandler,
    decrementHandler,
  };

  useEffect(() => {
    if (cartStatus === 'loading') return;
    if (authStatus) {
      // info de DB
      setSubTotal(total(AllProductsCart));
      if (sincronizar === false) {
        if (statusOrder === 'succeded') {
          dispatch(resetState());
          dispatch(sync(true));
        }
        dispatch(getAllProductsCart(user.id));
        dispatch(sync(true));
      }
    }
    if (!authStatus) {
      // info de localStorage
      let guest = localStorage.getItem('cart');
      let guestParse = JSON.parse(guest);
      setSubTotal(total(AllProductsCart));
      dispatch(cartGuest(guestParse));
      if (sincronizar === false) {
        dispatch(sync(true));
      }
      setSubTotal(total(AllProductsCart));
    }
  }, [authStatus, sincronizar, user]);

  useEffect(() => {
    setSubTotal(total(AllProductsCart));
  }, [cartStatus, dispatch]);

  let content;
  if (cartStatus === 'loading') {
    content = (
      <Container>
        <CircularProgress />
        <h3 className="Cart__Cargando">Cargando... </h3>
      </Container>
    );
  } else if (cartStatus === 'failed') {
    content = (
      <Container>
        <CircularProgress />
        <h3 className="Cart__Cargando">Ha ocurrido un error...</h3>
      </Container>
    );
  } else if (cartStatus === 'succeded') {
    if (AllProductsCart.length > 0) {
      content = (
        <>
          <div className="products">
            <h2 className="titleCart">Carrito de compras</h2>
            <hr className="line" />
            <ul>
              {AllProductsCart.map((product) => {
                return (
                  <CartItem
                    key={product && product.id}
                    prod={product}
                    handlers={handlers}
                  />
                );
              })}
            </ul>
          </div>
          <div className="detail">
            <h2 className="titleCart">Detalle de compra</h2>
            <hr className="line" />
            <div className="Summary">
              <p id="subtotal">SUBTOTAL $ {subTotal}</p>
              <p id="iva">IVA $ {Math.ceil((subTotal * 21) / 100)}</p>
              <hr className="line" />
              <p id="total">TOTAL $ {Math.ceil((subTotal * 121) / 100)}</p>
            </div>
            <div>
              <Button
                id="cancelBtn"
                className="buttonCart"
                onClick={handleDelete}
              >
                Cancelar
              </Button>
              <Button
                id="confirmBtn"
                className="buttonCart"
                onClick={handleConfirm}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </>
      );
    } else {
      content = (
        <div className="ShoppingCartEmpty">
          <h1 className="titleCart">Carrito de compras</h1>
          <hr className="lineEmpty" />
          <h2 className="titleCart">Su carrito de compras está vacío</h2>
          <img
            className="imgCartEmpty"
            src="https://i.ibb.co/NWgzJPf/botella.png"
            alt="Carrito vacío"
          />
          <p>
            <Link to="/catalogue" className="link">
              Volver al catálogo
            </Link>
          </p>
        </div>
      );
    }
  }

  return (
    <div className="ShoppingCartBackImg">
      <div className="ShoppingCart">{content}</div>
    </div>
  );
}

export default Cart;
