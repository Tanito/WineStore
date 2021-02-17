import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  userLogoutEndpoint,
  addUserEndpoint,
  authLoginEndpoint,
  userOrdersEndpoint,
  userPromoteEndpoint,
  usersEndpoint,
  mailsEndpoint,
  authEndpoint,
} from '../constants/endpoints';
import { status } from '../constants/helpers';

const initialState_user = {
  user: {
    info: {},
    orders: [],
    usersList: [],
    status: 'idle',
    error: null,
    loginStatus: status.idle,
  },
};

export const createUser = createAsyncThunk('user/register', async (payload) => {
  const { user, formik } = payload;
  const user_response = await axios.post(addUserEndpoint, user);
  const { token } = user_response.data;
  const resPayload = {
    userRegister_response: user_response.data,
    formik,
    token,
  };
  return resPayload;
});

export const postUserLogin = createAsyncThunk(
  'user/login',
  async (payload, { dispatch }) => {
    let empty_storage = [];
    const { user, formik } = payload;
    const userLogin_response = await axios.post(authLoginEndpoint, user);
    if (userLogin_response) {
      let storageSTRG = localStorage.getItem('cart');

      if (!storageSTRG) {
        localStorage.setItem('cart', JSON.stringify(empty_storage));
        storageSTRG = localStorage.getItem('cart');
      }

      let storage = JSON.parse(storageSTRG);
      await storage.map((product) => {
        axios.post(
          usersEndpoint + userLogin_response.data.user.id + '/cart',
          product
        );
      });
    }
    const { token } = userLogin_response.data;
    const resPayload = {
      userLogin_response: userLogin_response.data,
      token,
      formik,
    };
    return resPayload;
  }
);

export const githubLogin = createAsyncThunk(
  'user/githublogin',
  async (_, { rejectWithValue }) => {
    const resp = await axios.get(authEndpoint + 'github/');
    let redirectURL = resp.request.responseURL;
    if (redirectURL) return window.location.replace(redirectURL);
    else return rejectWithValue(resp);
    return resp;
  }
);
export const googleLogin = createAsyncThunk(
  'user/googlelogin',
  async (_, { rejectWithValue }) => {
    const resp = await axios.get(authEndpoint + 'google/');
    let redirectURL = resp.request.responseURL;
    if (redirectURL) return window.location.replace(redirectURL);
    else return rejectWithValue(resp);
    return resp;
  }
);

export const userLogout = createAsyncThunk(
  'user/logout',
  async (payload, thunkApi) => {
    const userLogout_response = await axios.get(userLogoutEndpoint);
    return userLogout_response;
  }
);

export const getUserOrders = createAsyncThunk(
  'user/getUserOrders',
  async (id) => {
    const resp = await axios.get(userOrdersEndpoint + id + '/orders');
    return resp;
  }
);

export const userPromote = createAsyncThunk(
  'user/promote',
  async (id, { dispatch }) => {
    const resp = await axios.put(userPromoteEndpoint + id);
    if (resp.status === 200) {
      dispatch(allUsers());
    }
    return resp;
  }
);

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  const resp = await axios.get(usersEndpoint);
  return resp;
});

export const allUsers = createAsyncThunk(
  'users/getAllUsers',
  async (_, { getState }) => {
    const state = getState();
    const token = state.token.inMemoryToken;
    const resp = await axios.get(usersEndpoint, {
      headers: { Authorization: token },
    });
    return resp;
  },
  {
    condition: (payload, { getState }) => {
      const state = getState();
      const userStatus = state.user.user.status;
      if (userStatus === 'loading') return false;
    },
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUsers',
  async (id, { getState, dispatch }) => {
    const state = getState();
    const token = state.token.inMemoryToken;
    const resp = await axios.delete(usersEndpoint + id, {
      headers: { Authorization: token },
    });
    if (resp.status === 200) {
      dispatch(allUsers());
    }
    return resp;
  }
);

export const editUsers = createAsyncThunk(
  'users/editUsers',
  async ({ id, values }) => {
    const resp = await axios.put(usersEndpoint + id, values);
    return resp;
  }
);

export const sendEmail = createAsyncThunk('user/sendMail', async (payload) => {
  const resp = await axios.post(mailsEndpoint, payload);
  return resp;
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialState_user,
  reducers: {
    persistUserLogin: (state, { payload }) => {
      const { user } = payload;
      state.user.info = user;
    },
    resetStatus: (state, action) => {
      state.user.status = status.idle;
      state.user.loginStatus = status.idle;
    },
    resetUsers(state, action) {
      state.user.usersList = [];
      state.user.status = 'idle';
      state.user.error = null;
    },
  },
  extraReducers: {
    [createUser.pending]: (state, action) => {
      state.user.loginStatus = status.loading;
    },
    [createUser.fulfilled]: (state, { payload }) => {
      const { userRegister_response, formik } = payload;
      state.user.loginStatus = status.succeded;
      state.user.info = userRegister_response.user;
      formik.resetForm();
    },
    [createUser.rejected]: (state, action) => {
      const infoComplete = action.meta.arg;
      const info = {
        formik: infoComplete.formik,
        user: {
          email: infoComplete.user.email,
        },
      };
      state.user.loginStatus = status.failed;
      state.user.error = action.error;
      state.user.info = info;
    },
    [postUserLogin.pending]: (state, action) => {
      state.user.loginStatus = status.loading;
    },
    [postUserLogin.fulfilled]: (state, { payload }) => {
      const { userLogin_response, formik } = payload;
      state.user.loginStatus = status.succeded;
      state.user.info = userLogin_response.user;
      localStorage.removeItem('cart');
      formik.resetForm();
    },
    [postUserLogin.rejected]: (state, action) => {
      state.user.loginStatus = status.failed;
      state.user.error = action.error;
    },
    [getUserOrders.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [getUserOrders.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
      state.user.orders = payload.data;
    },
    [getUserOrders.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [userLogout.fulfilled]: (state, action) => {
      state.user.info = {};
      state.user.orders = [];
      state.user.status = 'idle';
      state.user.error = null;
      state.user.loginStatus = 'idle';
    },
    [userPromote.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [userPromote.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
    },
    [userPromote.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [getUsers.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [getUsers.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
      state.user.info = payload.data;
    },
    [getUsers.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [sendEmail.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [sendEmail.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
    },
    [sendEmail.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [allUsers.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [allUsers.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
      state.user.usersList = payload.data;
    },
    [allUsers.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [deleteUser.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [deleteUser.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
    },
    [deleteUser.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [editUsers.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [editUsers.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
      state.user.info = payload.data;
    },
    [editUsers.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [githubLogin.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [githubLogin.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
    },
    [githubLogin.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
    [googleLogin.pending]: (state, action) => {
      state.user.status = status.loading;
    },
    [googleLogin.fulfilled]: (state, { payload }) => {
      state.user.status = status.succeded;
    },
    [googleLogin.rejected]: (state, action) => {
      state.user.status = status.failed;
      state.user.error = action.error;
    },
  },
});
export const { persistUserLogin, resetStatus, resetUsers } = userSlice.actions;

export default userSlice;
