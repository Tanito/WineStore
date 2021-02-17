import store from '../../store';
import {
  setToken,
  eraseToken,
  getRefreshedToken,
  setRefreshTimeout,
} from '../../slices/tokenSlice';

const tokenManager = () => {
  const dispatch = store.dispatch;
  let refreshTimeout = null;
  let refreshBefore = 5000;
  let logoutEventName = '_logout_';

  window.addEventListener('storage', (event) => {
    if (event.key === logoutEventName) {
      removeToken();
    }
  });

  const setToken = (token) => {
    dispatch(setToken(token));
    // dispatch(setRefreshTimeout(token));
    refreshToken(token.expires);
    return true;
  };

  const refreshToken = (expires) => {
    // let delay = expires - refreshBefore;
    let delay = 10000;
    refreshTimeout = window.setTimeout(dispatch(getRefreshedToken), delay);
  };

  const clearRefreshToken = () => {
    if (!!refreshTimeout) {
      window.clearTimeout(refreshTimeout);
    }
    return;
  };
  const removeToken = () => {
    store.dispatch(eraseToken());
    clearRefreshToken();
    return;
  };

  const setRefreshBefore = (delta) => {
    refreshBefore = delta;
    return;
  };

  const setLogoutEventName = (name) => {
    logoutEventName = name;
    return;
  };

  const tryToRestoreToken = () => {
    store.dispatch(getRefreshedToken());
  };

  return {
    removeToken,
    setToken,
    setRefreshBefore,
    tryToRestoreToken,
    refreshToken,
  };
};

export default tokenManager();

// const tokenManager = () => {
//   let logoutEventName = 'logout';
//   let refreshEndpoint = 'http://localhost:3000/auth/refresh';
//   let inMemoryJWT = null;
//   let refreshTimeOut;
//   let isRefreshing = null;

//   const handleRefresh = () => {
//     if (isRefreshing) return;
//     else getRefreshedToken();
//   };

//   const getRefreshedToken = async () => {
//     console.log('GETTING REFRESHED TOKEN');
//     try {
//       isRefreshing = true;
//       const refreshed_token = await axios.get(refreshEndpoint, {
//         withCredentials: true,
//       });
//       if (refreshed_token.status !== 200) {
//         console.log('NOT 200 STATUS');
//         ereaseToken();
//         global.console.log('Token renewal failure');
//         return false;
//       }
//       let newToken = refreshed_token.data && refreshed_token.data.token;
//       let user = refreshed_token.data && refreshed_token.data.user;
//       if (newToken) {
//         setToken(newToken.token, newToken.expires);
//         return { user, newToken };
//       } else {
//         console.log('NO NEWTOKEN RECEIVED');
//         ereaseToken();
//         return false;
//       }
//     } catch (error) {
//       console.error(error);
//       return error;
//     } finally {
//       isRefreshing = null;
//     }
//   };
//   const refreshToken = (expires) => {
//     console.log('SETTING REFRESH TIMEOUT');
//     let delay = expires - 5000;
//     refreshTimeOut = window.setTimeout(getRefreshedToken, delay);
//   };

//   const clearRefreshTokenTimeout = () => {
//     if (refreshTimeOut) {
//       window.clearTimeout(refreshTimeOut);
//     }
//   };

//   const getToken = () => inMemoryJWT;

//   const setToken = (token, expires) => {
//     console.log('SETTING TOKEN');
//     inMemoryJWT = token;
//     refreshToken(expires);
//     return true;
//   };

//   const logout = () => ereaseToken;

//   const ereaseToken = () => {
//     console.log('ERASING TOKEN');
//     inMemoryJWT = null;
//     clearRefreshTokenTimeout();
//     window.localStorage.setItem(logoutEventName, Date.now());
//     return true;
//   };

//   return {
//     ereaseToken,
//     getToken,
//     setLogoutEventName,
//     setRefreshTokenEndpoint,
//     setToken,
//     getRefreshedToken,
//     handleRefresh,
//   };
// };
