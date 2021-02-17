import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './ProductForm.modules.css';

//Revisar, en el formulario los multiples ID (mala practica)

function ProductForm() {
  const [state, setstate] = useState({
    marca: '',
    cepa: '',
    price: '',
    description: '',
    yearHarvest: '',
    image: '',
    stock: '',
  });

  function handleOnChange(e) {
    if (
      e.target.name === 'price' ||
      e.target.name === 'yearHarvest' ||
      e.target.name === 'stock'
    ) {
      let value = parseInt(e.target.value);
      setstate({ ...state, [e.target.name]: value });
    } else setstate({ ...state, [e.target.name]: e.target.value });
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    if (
      state.cepa &&
      state.marca &&
      state.price &&
      state.description &&
      state.yearHarvest &&
      state.image &&
      state.stock
    ) {
      //unir cepa y marca en name, para luego ingresar a la base de datos el producto
      return alert('En Desarrollo ');
    } else return alert('Faltan datos por completar');
  }


  return (
    <div className="formProd">
      <form
        onSubmit={(e) => {
          handleOnSubmit(e);
        }}
        className="SearchBar__form"
        noValidate
        autoComplete="off"
      >
        <TextField
          id={state.price ? 'accepted' : 'error'}
          name="price"
          label="Precio"
          type="number"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <TextField
          id={state.marca ? 'accepted' : 'error'}
          name="marca"
          label="Marca"
          type="string"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <TextField
          id={state.cepa ? 'accepted' : 'error'}
          name="cepa"
          label="Cepa"
          type="string"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <TextField
          id={state.description ? 'accepted' : 'error'}
          name="description"
          label="Descripcion"
          type="string"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <TextField
          id={state.yearHarvest ? 'accepted' : 'error'}
          name="yearHarvest"
          label="Año cosecha"
          type="number"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <TextField
          id={state.image ? 'accepted' : 'error'}
          name="image"
          label="Img"
          type="string"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <TextField
          id={state.stock ? 'accepted' : 'error'}
          name="stock"
          label="Stock"
          type="number"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <Button type="submit">Agregar</Button>
      </form>
    </div>
  );
}

export default ProductForm;
/* {
  //<TextField id="standard-basic" label="Bodega" onChange={(e) => {setinputSearch(e.target.value);}}/>
}
{
  <TextField id={state.name ? 'accepted' : 'error'}        name='name'        label="Nombre"      type='string'  onChange={(e) => {handleOnChange(e)}}/> 
} */
