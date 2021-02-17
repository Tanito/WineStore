import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { productEndpoint, searchProductEndpoint } from '../constants/endpoints';
import { status } from '../constants/helpers';

const initialState_product = {
  allProducts: {
    list: [],
    status: 'idle',
    error: null,
    lastAdded: {},
    lastDeleted: {},
    lastUpdated: {},
  },
  vinoEncontrado: '',
};

export const getAllProducts = createAsyncThunk(
  'product/getAllProducts',
  async () => {
    const resp = await axios.get(productEndpoint);
    return resp;
  }
);

export const postNewProduct = createAsyncThunk(
  'product/postNewProduct',
  async ({ product, formik }) => {
    const newProd = await axios.post(productEndpoint, product);
    // await thunkApi.dispatch(setWineDetailAsync(product));
    const payload = {
      newProd: newProd.data,
      formik,
    };
    return payload;
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async ({ id, formik }) => {
    const deletedWine = await axios.delete(productEndpoint + id);
    const payload = { deletedWine: deletedWine.data, formik };
    return payload;
  }
);

export const getProductSearch = createAsyncThunk(
  'product/getProductSearch',
  async (inputSearch) => {
    const resp = await axios.get(searchProductEndpoint + `${inputSearch}`);
    return resp;
  }
);
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ product, formik, emptyValues }) => {
    const categories = product.categories;
    const updated_prod = await axios.put(productEndpoint + product.id, product);
    const payload = {
      updatedProduct: updated_prod.data,
      formik,
      emptyValues,
      categories,
    };
    return payload;
  }
);

const productsSlice = createSlice({
  name: 'product',
  initialState: initialState_product,
  reducers: {
    addWine: (state, action) => {
      const { wine } = action.payload;
      state.allProducts.list.concat(wine);
    },
    findWine: (state, action) => {
      const { wineAencontrar } = action.payload;
      const vinoEncontrado = state.allProducts.list.find(
        (wine) => wine.id === wineAencontrar
      );
      if (vinoEncontrado) {
        state.vinoEncontrado = vinoEncontrado;
      }
    },
    productPriceLess: (state, action) => {
      state.allProducts.list = state.allProducts.list.filter((product) => {
        return product.price <= action.payload
      })
    },
    productPriceBetween : (state, action) => {
      state.allProducts.list = state.allProducts.list.filter((product) => {
        return product.price > action.payload.e && product.price < action.payload.f
      })
    },
    productPriceMore: (state, action) => {
      state.allProducts.list = state.allProducts.list.filter((product) => {
        return product.price >= action.payload
      })
    },
  },
  extraReducers: {
    [getAllProducts.pending]: (state, action) => {
      state.allProducts.status = status.loading;
    },
    [getAllProducts.fulfilled]: (state, { payload }) => {
      state.allProducts.status = status.succeded;
      state.allProducts.list = payload.data;
    },
    [getAllProducts.rejected]: (state, action) => {
      state.allProducts.status = status.failed;
      state.allProducts.error = action.error;
    },
    [getProductSearch.pending]: (state, action) => {
      state.allProducts.status = status.loading;
    },
    [getProductSearch.fulfilled]: (state, { payload }) => {
      state.allProducts.status = status.succeded;
      state.allProducts.list = payload.data;
    },
    [getProductSearch.rejected]: (state, action) => {
      state.allProducts.status = status.failed;
      state.allProducts.error = action.error;
    },
    [postNewProduct.pending]: (state, action) => {
      state.allProducts.status = status.loading;
    },
    [postNewProduct.fulfilled]: (state, action) => {
      const { formik, newProd } = action.payload;
      state.allProducts.status = status.succeded;
      state.allProducts.list.push(newProd);
      state.allProducts.lastAdded = newProd;
      formik.resetForm();
    },
    [postNewProduct.rejected]: (state, action) => {
      state.allProducts.status = status.failed;
      state.allProducts.error = action.error;
    },
    [deleteProduct.pending]: (state, action) => {
      state.allProducts.status = status.loading;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      const { formik, deletedWine } = action.payload;
      state.allProducts.status = status.succeded;
      state.allProducts.list = state.allProducts.list.filter(
        ({ id }) => id !== deletedWine.wine.id
      );
      state.allProducts.lastDeleted = deletedWine;
      formik.resetForm();
    },
    [deleteProduct.rejected]: (state, action) => {
      state.allProducts.status = status.failed;
      state.allProducts.error = action.error;
    },
    [updateProduct.pending]: (state, action) => {
      state.allProducts.status = status.loading;
    },
    [updateProduct.fulfilled]: (state, action) => {
      const {
        formik,
        updatedProduct,
        emptyValues,
        categories,
      } = action.payload;
      let catToReset = {
        taste1: !!categories[0] ? categories[0] : '',
        taste2: !!categories[1] ? categories[1] : '',
        taste3: !!categories[2] ? categories[2] : '',
      };
      state.allProducts.status = status.succeded;
      state.allProducts.lastUpdated = updatedProduct;
      let idx = state.allProducts.list.findIndex(
        ({ id }) => id === updatedProduct.id
      );
      state.allProducts.list[idx] = { ...updatedProduct };
      formik.resetForm({
        values: { ...updatedProduct, ...catToReset },
        errors: { ...emptyValues },
      });
    },
    [updateProduct.rejected]: (state, action) => {
      state.allProducts.status = status.failed;
      state.allProducts.error = action.error;
    },
  },
});

export const { findWine, addWine, productPriceLess, productPriceBetween, productPriceMore } = productsSlice.actions;

export default productsSlice;
