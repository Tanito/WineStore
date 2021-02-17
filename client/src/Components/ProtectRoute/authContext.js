import React from 'react';

export const AuthContext = React.createContext(false);

export const useAuthContext = () => {
  return React.useContext(AuthContext);
};

export const useAuthProvider = () => {
  const isAdmin = () => {};
};
