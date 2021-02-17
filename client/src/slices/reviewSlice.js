import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  addUserReviewEndpoint,
  getUserReviewsEndpoint,
  getProductReviews,
} from '../constants/endpoints';
import { status } from '../constants/helpers';

const initialState_review = {
  reviews: {
    info: [], // [{id, points, description, productId, createdAt}, {id, points, description, productId, createdAt}]
    status: 'idle',
    error: null,
  },
};

export const getUserReviews = createAsyncThunk(
  'review/getUserReviews',
  async (userId) => {
    const userReviews_response = await axios.get(
      getUserReviewsEndpoint + userId
    );
    return userReviews_response;
  }
);

export const productReviews = createAsyncThunk(
  'review/productReviews',
  async (productId) => {
    const productReviews_response = await axios.get(
      getProductReviews + productId
    );
    return productReviews_response;
  }
);

export const createReview = createAsyncThunk(
  'review/createReview',
  async (payload) => {
    const review_response = await axios.post(
      addUserReviewEndpoint + payload.productId,
      payload
    );
    return review_response;
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: initialState_review,
  reducers: {
    postReview(state, action) {
      state.reviews.info.push(action.payload);
    },
  },
  extraReducers: {
    [createReview.pending]: (state, action) => {
      state.reviews.status = status.loading;
    },
    [createReview.fulfilled]: (state, { payload }) => {
      state.reviews.status = status.succeded;
    },
    [createReview.rejected]: (state, action) => {
      state.reviews.status = status.failed;
      state.reviews.error = action.error;
    },
    [getUserReviews.pending]: (state, action) => {
      state.reviews.status = status.loading;
    },
    [getUserReviews.fulfilled]: (state, action) => {
      state.reviews.status = status.succeded;
      state.reviews.info = action.payload.data;
    },
    [getUserReviews.rejected]: (state, action) => {
      state.reviews.status = status.failed;
      state.reviews.error = action.error;
    },
    [productReviews.pending]: (state, action) => {
      state.reviews.status = status.loading;
    },
    [productReviews.fulfilled]: (state, action) => {
      state.reviews.status = status.succeded;
      state.reviews.info = action.payload.data;
    },
    [productReviews.rejected]: (state, action) => {
      state.reviews.status = status.failed;
      state.reviews.error = action.error;
    },
  },
});

export const { postReview } = reviewSlice.actions;

export default reviewSlice;
