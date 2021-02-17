import tokenManager from './tokenManager';
import store from '../../store';

let state = store.getState();
export const isLogged = () => {
  let token = state.token.inMemoryToken;
  if (!token) {
    tokenManager.tryToRestoreToken();
  }
};

export const isAdmin = () => {};
