import React from 'react';
import Carrousel from '../Carrousel/Carrousel.jsx';
import Contenido from '../Contenido/Contenido.jsx';
import Footer from '../Footer/Footer.jsx';
import {userStatusSelector, userSelector} from '../../selectors'
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../ProtectRoute/authContext';
import { cartGuest, postProductToCart } from '../../slices/productsCartSlice.js';

// Recibe props con Products.info

function Inicio() {
  const dispatch = useDispatch()
  const userStatus = useSelector(userStatusSelector);
  const user = useSelector(userSelector);
  const authStatus = useAuthContext();
  if( authStatus){

    let storageSTRG = localStorage.getItem('cart');
    let storage = JSON.parse(storageSTRG);
    storage && dispatch(cartGuest(storage)) 
   storage && storage.map(product =>{
      let payload = {
        id: product.id,
        detail:product,
        quantity:product.quantity,
        price:product.price,
        userId:user.id,
        name:product.name,
        description: product.description,
        increment:true,
      }
       dispatch(postProductToCart(payload));
    })
     localStorage.removeItem('cart')
  }

  return (

    <div>
      <Carrousel></Carrousel>
      <Contenido></Contenido>
      <Footer></Footer>
    </div>
  );
}

export default Inicio;
