import React, { Suspense } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuthContext } from './authContext';

function GuestRoute({ component: Component, ...rest }) {
  const authStatus = useAuthContext();
  const PROFILE = '/catalogue';
  return (
    <Route
      {...rest}
      render={(props) =>
        !authStatus ? <Component {...props} /> : <Redirect to={PROFILE} />
      }
    />
  );
}

export default GuestRoute;
