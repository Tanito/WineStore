import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { status } from '../constants/helpers';
import { refreshEndpoint } from '../constants/endpoints.js';
import tokenManager from '../Components/utils/tokenManager';

const initialState_token = {
  tryToLoginStatus: status.idle,
  inMemoryToken: null,
  refreshQueued: false,
  refreshStatus: status.idle,
  stopRefresh: false,
  delay: 60 * 15 * 1000, //15 min default
  refreshTimeDelta: 5000,
  logoutEventName: '_logout_',
  refreshEndpoint: refreshEndpoint,
  error: null,
};

//!NO OLVIDARSE DE PONER EN APP
// window.addEventListener('storage', (event) => {
//   if (event.key === initialState_token.logoutEventName) {
//     removeToken();
//   }
// });

export const tryToLogin = createAsyncThunk(
  'token/tryToLogin',
  async (_, { rejectWithValue }) => {
    const refreshed_token = await axios.get(refreshEndpoint, {
      withCredentials: true,
    });
    if (refreshed_token.status !== 200) {
      return rejectWithValue(refreshed_token);
    } else return refreshed_token.data;
  },
  {
    condition: (payload, { getState }) => {
      const { token } = getState();
      if (
        token.stopRefresh === true ||
        token.tryToLoginStatus === status.loading ||
        token.tryToLoginStatus === status.failed
      ) {
        return false;
      }
    },
  }
);

export const getRefreshedToken = createAsyncThunk(
  'token/getRefreshedToken',
  async (_, { rejectWithValue }) => {
    const refreshed_token = await axios.get(refreshEndpoint, {
      withCredentials: true,
    });
    if (refreshed_token.status !== 200) {
      return rejectWithValue(refreshed_token);
    } else return refreshed_token.data;
  },
  {
    condition: (payload, { getState }) => {
      const { token } = getState();
      if (
        token.stopRefresh === true ||
        token.refreshStatus === status.loading ||
        token.refreshStatus === status.failed
      ) {
        return false;
      }
    },
  }
);

var delayTimeout;
const delayRefresh = (delay) => {
  return new Promise((resolve) => {
    delayTimeout = window.setTimeout(() => {
      resolve('!!!');
    }, delay);
  });
};

export const setRefreshTokenTimeout = createAsyncThunk(
  'token/refreshTimeout',
  async (payload, { dispatch, getState }) => {
    const state = getState();
    // let delay = state.token.delay;
    let delay = 1000000;
    return await delayRefresh(delay);
  }
);

const tokenSlice = createSlice({
  name: 'token',
  initialState: initialState_token,
  reducers: {
    setToken: (state, { payload }) => {
      const { token, expires } = payload;
      state.inMemoryToken = token;
      state.delay = expires - state.refreshTimeDelta;
      return;
    },
    eraseToken: (state, action) => {
      state.stopRefresh = true;
      state.inMemoryToken = null;
      state.refreshQueued = false;
      state.status = status.idle;
      state.refreshStatus = status.idle;
      state.error = null;
      // state.tryToLoginStatus = status.idle;

      window.clearTimeout(delayTimeout);
      window.localStorage.setItem(state.logoutEventName, Date.now());
    },
    setRefreshQueue: (state, { payload }) => {
      state.refreshQueued = payload;
    },
    setRefreshTimeDelta: (state, { payload }) => {
      state.refreshTimeDelta = payload;
    },
    setTryToLoginStatus: (state, { payload }) => {
      state.tryToLoginStatus = payload;
    },
    setStopRefreshFalse: (state, { payload }) => {
      state.stopRefresh = false;
    },
  },
  extraReducers: {
    [getRefreshedToken.pending]: (state, action) => {
      state.refreshStatus = status.loading;
    },
    [getRefreshedToken.fulfilled]: (state, { payload }) => {
      const { newToken, user } = payload;
      state.refreshStatus = status.succeded;
      state.inMemoryToken = newToken.token;
      state.delay = newToken.expires - state.refreshTimeDelta;
    },
    [getRefreshedToken.rejected]: (state, { payload }) => {
      state.refreshStatus = status.failed;
      state.inMemoryToken = null;
      state.refreshQueued = false;
      state.error = payload;
      window.localStorage.setItem(state.logoutEventName, Date.now());
    },
    [setRefreshTokenTimeout.pending]: (state, { payload }) => {
      state.refreshQueued = true;
    },
    [setRefreshTokenTimeout.rejected]: (state, { payload }) => {
      state.status = status.failed;
      state.refreshQueued = false;
    },
    [tryToLogin.pending]: (state, action) => {
      state.tryToLoginStatus = status.loading;
    },
    [tryToLogin.rejected]: (state, action) => {
      state.tryToLoginStatus = status.failed;
    },
    [tryToLogin.fulfilled]: (state, action) => {
      state.tryToLoginStatus = status.succeded;
    },
  },
});

export const {
  setToken,
  eraseToken,
  setRefreshQueue,
  setTryToLoginStatus,
  setStopRefreshFalse,
} = tokenSlice.actions;

export default tokenSlice;
