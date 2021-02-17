import productSlice from '../slices/productSlice';
import categorySlice from '../slices/categorySlice';
import productDetailSlice from '../slices/productDetailSlice';
import productsCartSlice from './productsCartSlice';
import orderTableSlice from './orderTableSlice';
import strainSlice from '../slices/strainSlice';
import userSlice from './userSlice';
import reviewSlice from './reviewSlice';
import notificationSlice from './notificationSlice';
import tokenSlice from './tokenSlice';
import checkoutSlice from './checkoutSlice';

const rootReducer = {
  products: productSlice.reducer,
  categories: categorySlice.reducer,
  wineDetail: productDetailSlice.reducer,
  cart: productsCartSlice.reducer,
  strains: strainSlice.reducer,
  orderTable: orderTableSlice.reducer,
  user: userSlice.reducer,
  reviews: reviewSlice.reducer,
  notifications: notificationSlice.reducer,
  token: tokenSlice.reducer,
  checkout: checkoutSlice.reducer,
};

export default rootReducer;
