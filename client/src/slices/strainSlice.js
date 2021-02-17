import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { strainsEndpoint } from '../constants/endpoints';
import { status } from '../constants/helpers';
import axios from 'axios';

const initialState_strain = {
  status: 'idle',
  error: null,
  allStrains: {
    list: [],
    lastAdded: {},
    lastDeleted: {},
  },
};

//*Busca todas las cepas `strains` y devuelve un array de objetos
export const getAllStrains = createAsyncThunk(
  'strain/getAllStrains',
  async () => {
    const resp = await axios.get(strainsEndpoint);
    return resp;
  }
);

//*Postea una nueva cepa, y devuelve la cepa posteada
export const postNewStrain = createAsyncThunk(
  'strain/postNewStrain',
  async ({ newStrain, formik }) => {
    const resp = await axios.post(strainsEndpoint, newStrain);
    const payload = { resp, formik };
    return payload;
  }
);

//*Borra la cepa y devuele la cepa borrada
export const deleteStrain = createAsyncThunk(
  'strain/deleteStrain',
  async ({ strainId, formik }) => {
    const resp = await axios.delete(strainsEndpoint + strainId);
    const payload = { resp, formik };
    return payload;
  }
);

export const strainSlice = createSlice({
  name: 'strain',
  initialState: initialState_strain,
  reducers: {},
  extraReducers: {
    [getAllStrains.pending]: (state, action) => {
      state.status = status.loading;
    },
    [getAllStrains.fulfilled]: (state, { payload }) => {
      state.status = status.succeded;
      state.allStrains.list = payload.data;
    },
    [getAllStrains.rejected]: (state, action) => {
      state.status = status.failed;
      state.error = action.error;
    },
    [postNewStrain.pending]: (state, action) => {
      state.status = status.loading;
    },
    [postNewStrain.fulfilled]: (state, action) => {
      const { formik, resp } = action.payload;
      state.status = status.succeded;
      state.allStrains.list.push(resp.data[0]);
      state.allStrains.lastAdded = resp.data[0];
      formik.resetForm();
    },
    [postNewStrain.rejected]: (state, action) => {
      state.status = status.failed;
      state.error = action.error;
    },
    [deleteStrain.pending]: (state, action) => {
      state.status = status.loading;
    },
    [deleteStrain.fulfilled]: (state, action) => {
      const { strainId } = action.meta.arg;
      const { formik } = action.payload;
      state.status = status.succeded;
      state.allStrains.lastDeleted = state.allStrains.list.find(
        (strain) => strain.id === strainId
      );
      const filtered_strain_list = state.allStrains.list.filter(
        (strain) => strain.id !== strainId
      );
      state.allStrains.list = filtered_strain_list;
      formik.resetForm();
    },
    [deleteStrain.rejected]: (state, action) => {
      state.status = status.failed;
      state.error = action.error;
    },
  },
});

export default strainSlice;
