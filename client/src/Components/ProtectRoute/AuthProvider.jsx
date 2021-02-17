import React, { useEffect } from 'react';
import {
  tokenSelector,
  tryToLoginStatusSelector,
  refreshStatusSelector,
} from '../../selectors';
import { AuthContext, useAuthProvider } from './authContext';
import { useDispatch, useSelector } from 'react-redux';
import { getRefreshedToken, tryToLogin } from '../../slices/tokenSlice';
import { Container, CircularProgress } from '@material-ui/core';
import { useState } from 'react';
import { userLoginStatusSelector } from '../../selectors/index';

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const userStatus = useSelector(userLoginStatusSelector);
  const tryToLoginStatus = useSelector(tryToLoginStatusSelector); //idle

  const isLogged = () => {
    if (tryToLoginStatus === 'idle') {
      dispatch(tryToLogin());
    }
  };

  useEffect(() => {
    isLogged();
  }, [tryToLoginStatus, dispatch]);

  if (tryToLoginStatus === 'loading' || userStatus === 'loading') {
    return (
      <Container>
        <CircularProgress />
        <CircularProgress />
        <CircularProgress />
        <CircularProgress />
        <CircularProgress />
        <CircularProgress />
      </Container>
    );
  } else if (tryToLoginStatus !== 'succeded') {
    return (
      <AuthContext.Provider value={false}>{children}</AuthContext.Provider>
    );
  } else if (tryToLoginStatus === 'succeded') {
    return <AuthContext.Provider value={true}>{children}</AuthContext.Provider>;
  }

  return null;
}

export default AuthProvider;
