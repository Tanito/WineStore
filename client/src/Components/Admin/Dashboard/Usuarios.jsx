import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import './Dashboard.modules.css';
import {
  allUsers,
  userPromote,
  sendEmail,
  //resetUsers,
  deleteUser,
} from '../../../slices/userSlice';
import Pagination from '@material-ui/lab/Pagination';
import { usersListSelector, userStatusSelector } from '../../../selectors';
// import EditIcon from '@material-ui/icons/Edit';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { CircularProgress, Button } from '@material-ui/core';

// Esta tabla es para el admin.
// Tiene que mostrar todos los usuarios.

function Usuarios() {
  const dispatch = useDispatch();
  //const history = useHistory();
  const users = useSelector(usersListSelector);
  const status = useSelector(userStatusSelector);
  //const [value, setValue] = useState(0); // Rating traer promedio de calificación de base de datos según producto
  const [page, setPage] = useState(1);
  const cantidadAMostrar = 3;
  let content;

  function handleClickPagination(e, num) {
    setPage(num);
  }

  const handleRetry = () => {
    //func para reintentar y forzar refresh
    window.location.reload();
    return false;
  };

  const promoteUser = (id) => {
    let user = users.filter((u) => u.id === id);
    dispatch(userPromote(id));
    dispatch(
      sendEmail({
        name: user[0].firstName,
        email: user[0].email,
        type: 'Promote',
      })
    );
  };

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  // Deshabilité el edit de usuarios por parte del admin (si se deja así además de borrar lo comentado habría que eliminar el archivo "EditUser.jsx")
  /*   const editUserHandler = (id) => {
    history.push(`admin/edituser/${id}`);
  }; */

  useEffect(() => {
    if (status === 'idle') dispatch(allUsers());
  }, [dispatch, users]);

  if (status === 'loading') {
    content = (
      <>
        <h2>Cargando...</h2>
        <CircularProgress />
      </>
    );
  } else if (status === 'succeded') {
    content = users
      .slice((page - 1) * cantidadAMostrar, page * cantidadAMostrar)
      .map((user, idx) => {
        let even = idx % 2 === 0 ? 'white' : 'beige';
        return (
          <>
            <div className="grid-item" style={{ backgroundColor: even }}>
              {user.id}
            </div>
            <div className="grid-item" style={{ backgroundColor: even }}>
              {user.firstName + ' ' + user.lastName}
            </div>
            {!user.isAdmin ? (
              <Button
                className="editButton"
                style={{ backgroundColor: even }}
                onClick={() => promoteUser(user.id)}
              >
                <ArrowUpwardIcon className="grid-item"></ArrowUpwardIcon>
              </Button>
            ) : (
              <Button
                className="editButton"
                style={{ backgroundColor: even }}
                disabled="true"
              >
                <ArrowUpwardIcon className="grid-item"></ArrowUpwardIcon>
              </Button>
            )}
            <div className="grid-item" style={{ backgroundColor: even }}>
              <a href="#" className="Cart__DeleteProduct">
                <i
                  class="fas fa-trash-alt"
                  onClick={() => deleteUserHandler(user.id)}
                ></i>
              </a>
            </div>
            {/*           <div className="grid-item" style={{ backgroundColor: even }}>
            <Button
              className="editButton"
              style={{ backgroundColor: even }}
              onClick={() => editUserHandler(user.id)}
            >
              <EditIcon className="grid-item"></EditIcon>
            </Button>
          </div> */}
          </>
        );
      });
    content.push(
      <div className="Catalogue__Pagination">
        <Pagination
          onChange={handleClickPagination}
          count={Math.ceil(users.length / cantidadAMostrar)}
          variant="outlined"
          shape="rounded"
        />
      </div>
    );
  } else if (status === 'failed') {
    content = (
      <>
        <h3>Ha ocurrido un error</h3>
        <Button onClick={handleRetry}>Reintentar</Button>
      </>
    );
  }
  return (
    <div className="grid-container-usuarios">
      <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Id
      </p>
      <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Usuario
      </p>
      <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Promover
      </p>
      <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Borrar
      </p>
      {/*       <p className="grid-item" style={{ fontWeight: 'bold' }}>
        Editar
      </p> */}
      {content}
    </div>
  );
}
export default Usuarios;
