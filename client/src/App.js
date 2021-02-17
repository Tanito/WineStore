import React from 'react';
import './App.modules.css';
import Catalogue from './Components/Catalogue/Catalogue.jsx';
import CatalogueByTaste from './Components/Catalogue/CatalogueByTaste.jsx';
import ProductForm from './Components/Forms/ProductForm.jsx';
import { Redirect, Route, Switch } from 'react-router-dom';
import NavBar from './Components/SearchBar/NavBar.jsx';
import Inicio from './Components/Inicio/Inicio.jsx';
import TestForm from './Components/FormComponents/TestForm.jsx';
import AdminPanel from './Components/Admin/AdminPanel';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import Cart from './Components/Cart/Cart.jsx';
import OrderTable from './Components/OrderTable/OrderTable.jsx';
import notFound from './Components/notFound/notFound';
import UserForm from './Components/Forms/User/UserForm';
import UserLogin from './Components/Forms/User/UserLogin';
import axios from 'axios';
import ProtectRoute from './Components/ProtectRoute/ProtectRoute';
import { isLogged, isAdmin } from './Components/utils/index';
import tokenManager from './Components/utils/tokenManager';
import Notifier from './Components/Notifier/Notifier';
import AuthProvider from './Components/ProtectRoute/AuthProvider';
import Checkout from './Components/Checkout/Checkout';
import Profile from './Components/Profile/Profile';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import GuestRoute from './Components/ProtectRoute/GuestRoute';
import Payments from './Components/Checkout/Payments';
import AdminProduct from './Components/Admin/LoadProduct/AdminProduct';

function App() {
  // //!SOLUCION CAVERNICOLA!
  if (isLogged()) {
    axios.defaults.headers.common['Authorization'] = tokenManager.getToken();
  }
  axios.defaults.withCredentials = true;
  // //!<-----------------

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossOrigin="anonymous"
      />
      <Notifier />
      <AuthProvider>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Inicio}></Route>
          <Route exact path="/catalogue" component={Catalogue}></Route>
          <Route path="/catalogue/:taste" render={() => <CatalogueByTaste />} />
          <Route path="/product/:id" render={() => <ProductDetail />} />
          <Route path="/admin/form-product" component={ProductForm} />
          <Route path="/form/test" component={TestForm} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/cart" component={Cart} />
          <Route path="/order-table" component={OrderTable} />
          <GuestRoute path="/form/user/login" component={UserLogin} />
          <GuestRoute path="/form/user" component={UserForm} />
          <Route path="/payments" component={Payments} />
          <Route exact path="/dashboard" component={Dashboard} />
          <ProtectRoute path="/user/profile" component={Profile} />
          <Route path="/404" component={notFound} />
          <Route path="/checkout" component={Checkout} />
          <Route exact path="/dashboard/loadproduct" component={AdminProduct}/>
          <Redirect to="/404" />
        </Switch>
      </AuthProvider>
    </div>
  );
}

export default App;
