import React, { useEffect } from 'react';
import { Paper, Container } from '@material-ui/core';
import './AdminPanel.modules.css';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import AdminStrain from './LoadCategory/AdminStrain';
import AdminCategory from './LoadCategory/AdminCategory';
import AdminProduct from './LoadProduct/AdminProduct';
import PromoteUser from './PromoteUser/PromoteUser';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, userStatusSelector } from '../../selectors/index';
import { allUsers } from '../../slices/userSlice';
import EditUser from './EditUser/EditUser';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  //const userStatus = useSelector(userStatusSelector);

  useEffect(() => {
    dispatch(allUsers());
  }, []);

  return (
    <Container className="AdminPanel">
      {/* {user.isAdmin ? (
        <Paper id="backgroundPaper" className="AdminPanel__Panel">
          <h1 className="AdminPanel__Title">ADMIN PANEL</h1>
          <img
            className="imgAdmin"
            src="https://i.ibb.co/JKQk16V/racimo-de-uvas.png"
            alt="No se puede cargar la imagen"
          />
          <br></br>
          <ul className="AdminPanel__Ul">
            <li>
              <Link className="links" to="/admin/loadproduct">
                Cargar Producto
              </Link>
            </li>
            <li>
              <Link className="links" to="/admin/loadcategory">
                Cargar/Borrar Categoria
              </Link>
            </li>
            <li>
              <Link className="links" to="/admin/loadstrain">
                Cargar/Borrar Cepa
              </Link>
            </li>
            <li>
              <Link className="links" to="/order-table">
                Ver Órdenes
              </Link>
            </li>
            <li>
              <Link className="links" to="/admin/promoteuser">
                Promover usuario a Admin
              </Link>
            </li>
          </ul>
        </Paper>
      ) : null} */}
      <br></br>
      <h1 className="Admin__H1">Formularios del Administrador</h1>
      <br></br>
      <Container className="AdminPanel__Form">
        <Route path="/admin/loadproduct" component={AdminProduct} />
        <Route path="/admin/loadcategory" component={AdminCategory} />
        <Route path="/admin/loadstrain" component={AdminStrain} />
        <Route path="/admin/edit/:id" component={AdminProduct} />
        <Route path="/admin/promoteuser" component={PromoteUser} />
        <Route path="/admin/edituser/:id" component={EditUser} />
      </Container>
    </Container>
  );
};

export default AdminPanel;
