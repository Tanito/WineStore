import { createSlice } from '@reduxjs/toolkit';

const initialState_notification = {
  list: [],
};
const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState_notification,
  reducers: {
    enqueueSnackbar: (state, { payload }) => {
      let {
        options: { key },
        message,
        options,
      } = payload;
      state.list.push({ key, message, options });
    },
    closeSnackbar: (state, { payload }) => {
      const { key, dismissAll } = payload;
      state.list = state.list.filter((notification) => {
        if (notification.key === payload)
          return (notification.dismissed = true);
        else return notification;
      });
    },
    clearSnackbar: (state, { payload }) => {
      state.list = state.list.forEach(
        ((notification) => notification.dismissed = true)
      );
    },
    removeSnackbar: (state, { payload }) => {
      state.list = state.list.filter(
        (notification) => notification.key !== payload
      );
    },
  },
});

export const {
  enqueueSnackbar,
  closeSnackbar,
  clearSnackbar,
  removeSnackbar,
} = notificationSlice.actions;

export default notificationSlice;
