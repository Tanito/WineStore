import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { productEndpoint } from '../constants/endpoints';
import { status } from '../constants/helpers';
import { getAllCatsOfProduct } from './categorySlice';

const initialState_product = {
  wineDetail: {
    wine: {},
    categories: [],
    status: 'idle',
    error: null,
  },
};

export const setWineDetailAsync = createAsyncThunk(
  'productDetail/setWineDetailAsync',
  async (id, thunkApi) => {
    const categories = await thunkApi.dispatch(getAllCatsOfProduct(id));
    const prod_detail = await axios.get(productEndpoint + id);
    const payload = {
      wineDetail: prod_detail.data,
      categories: categories.payload.data,
    };
    return payload;
  }
);

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState: initialState_product,
  reducers: {
    wineDetails(state, action) {
      state.wineDetail.wine = action.payload;
    },
    resetDetailStatus(state, action) {
      state.wineDetail.status = status.idle;
    },
  },
  extraReducers: {
    [setWineDetailAsync.pending]: (state, action) => {
      state.wineDetail.status = status.loading;
    },
    [setWineDetailAsync.fulfilled]: (state, { payload }) => {
      state.wineDetail.status = status.succeded;
      state.wineDetail.wine = payload.wineDetail;
      state.wineDetail.categories = payload.categories;
    },
    [setWineDetailAsync.rejected]: (state, action) => {
      state.wineDetail.status = status.failed;
      state.wineDetail.error = action.error;
    },
  },
});
export const { wineDetails, resetDetailStatus } = productDetailSlice.actions;
export default productDetailSlice;
