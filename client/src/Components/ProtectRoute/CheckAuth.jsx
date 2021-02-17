import { CircularProgress, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { tokenSelector, tokenStatusSelector } from '../../selectors';
import { getRefreshedToken } from '../../slices/tokenSlice';

import store from '../../store';

function CheckAuth({ children, ...rest }) {
  const dispatch = useDispatch();

  const token = useSelector(tokenSelector);
  const tokenStatus = useSelector(tokenStatusSelector);

  const isLogged = (token) => {
    if (!token && tokenStatus === 'idle') {
      dispatch(getRefreshedToken());
    }
  };

  useEffect(() => {
    isLogged(token);
  }, [tokenStatus, dispatch]);

  let display;
  if (tokenSelector === 'loading' && !token) {
    display = (
      <Container>
        <h2>Buscando sesion anterior</h2>
        <CircularProgress />
      </Container>
    );
  } else if (tokenSelector === 'failed' && !token) {
    display = childern;
  } else if (tokenSelector === 'succeded' && token) {
    display = children;
  }

  return <Container>{display}</Container>;
}
export default CheckAuth;

// export default checkAuth;

// class RequireAuth extends Component {
//   state = { isAuthenticated: false };

//   componentDidUpdate = (prevProps, prevState) => {
//     if (
//       this.props.location.pathname !== prevProps.location.pathname &&
//       !this.state.isAuthenticated
//     ) {
//       this.props.history.push('/');
//     }
//   };

//   isAuthed = () => this.setState({ isAuthenticated: true });

//   unAuth = () => this.setState({ isAuthenticated: false });

//   render = () =>
//     !this.state.isAuthenticated ? (
//       <Login isAuthed={this.isAuthed} />
//     ) : (
//       <Fragment>
//         <Header unAuth={this.unAuth} />
//         {this.props.children}
//       </Fragment>
//     );
// }

// export default withRouter(RequireAuth);
