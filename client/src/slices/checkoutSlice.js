import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { status } from '../constants/helpers';

const initialState_checkout = {
  checkout: {
    addressInfo : {
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        stateAddress: '',
        zip: '',
        country: '',
      },
      paymentInfo : {
        cardName: '',
        cardNumber: '',
        expDate: '',
        cvv: '',
      },
    status: 'idle',
    error: null,
  }
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: initialState_checkout,
    reducers: {
        addressInfoAction: (state, { payload }) => {
        // let {
        //     firstName,
        //     lastName,
        //     address1,
        //     address2,
        //     city,
        //     stateAddress,
        //     zip,
        //     country,
        // } = payload;
       state.addressInfo = { payload };
      },
      paymentInfoAction: (state, { payload }) => {
        const { key, dismissAll } = payload;
        state.list = state.list.filter((notification) => {
          if (notification.key === payload)
            return (notification.dismissed = true);
          else return notification;
        });
      }
     
    },
  });
  
  export const {
    addressInfoAction,
    paymentInfoAction,
  } = checkoutSlice.actions;
  
  export default checkoutSlice;
  


