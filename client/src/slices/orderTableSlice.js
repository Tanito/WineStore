import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { create } from 'yup/lib/Reference';
import tokenManager from '../Components/utils/tokenManager';
import { getOrderTableEndpoint, productEndpoint } from '../constants/endpoints';
import { status } from '../constants/helpers';
import { sendEmail } from './userSlice';

const initialState_orders = {
  orderTable: {
    orders: [],
    userId: 0,
    status: 'idle',
    sync: false,
    error: null,
  },
};

export const getOrderTable = createAsyncThunk(
  'orders/getOrderTable',
  async (_, { getState }) => {
    const state = getState();
    const token = state.token.inMemoryToken;
    const resp = await axios.get(getOrderTableEndpoint, {
      headers: { Authorization: token },
    });
    return resp;
  }
);

export const modificateOrder = createAsyncThunk(
  'cart/modificateOrder',
  async (payload, { dispatch, getState }) => {
    const { myCart, total, status } = payload;
    const state = getState();
    const modificatedOrder = await axios.put(
      getOrderTableEndpoint + myCart,
      payload
    );
    if (status === 'dispatched') {
      const name = state.user.user.info.firstName;
      const email = state.user.user.info.email;
      dispatch(
        sendEmail({
          name,
          email,
          type: 'Dispatch',
        })
      );
    }
    return { myCart, status };
  }
);

export const confirmOrder = createAsyncThunk(
  'cart/confirmOrder',
  async (payload, { dispatch }) => {
    const { order_payload, cart_payload } = payload;
    const { myCart, total, status } = order_payload;

    const modifyOrder_response = await axios.put(
      getOrderTableEndpoint + myCart,
      order_payload
    );
    const stockUpdate_response = await axios.put(
      productEndpoint + '/stockupdate',
      cart_payload
    );
    return { stockUpdate_response, modifyOrder_response };
  }
);

const orderTableSlice = createSlice({
  name: 'orderTable',
  initialState: initialState_orders,
  reducers: {
    resetOrderstatus: (state, action) => {
      state.orderTable.status = status.idle;
    },
  },
  extraReducers: {
    [getOrderTable.pending]: (state, action) => {
      state.orderTable.status = status.loading;
    },
    [getOrderTable.fulfilled]: (state, { payload }) => {
      state.orderTable.status = status.succeded;
      state.orderTable.orders = payload.data;
    },
    [getOrderTable.rejected]: (state, action) => {
      state.orderTable.status = status.failed;
      state.orderTable.error = action.error;
    },
    [modificateOrder.pending]: (state, action) => {
      state.orderTable.status = status.loading;
    },
    [modificateOrder.fulfilled]: (state, { payload }) => {
      const { myCart } = payload;
      state.orderTable.status = status.succeded;
      const orderToUpdate = state.orderTable.orders.find(
        ({ id }) => id === myCart
      );
      if (orderToUpdate) orderToUpdate.status = payload.status;
    },
    [modificateOrder.rejected]: (state, action) => {
      state.orderTable.status = status.failed;
      state.orderTable.error = action.error;
    },
    [confirmOrder.pending]: (state, action) => {
      state.orderTable.status = status.loading;
    },
    [confirmOrder.fulfilled]: (state, { payload }) => {
      state.orderTable.status = status.succeded;
    },
    [confirmOrder.rejected]: (state, action) => {
      state.orderTable.status = status.failed;
      state.orderTable.error = action.error;
    },
  },
});

export const { resetOrderstatus } = orderTableSlice.actions;

export default orderTableSlice;
