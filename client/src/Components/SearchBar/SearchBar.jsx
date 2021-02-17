import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './SearchBar.modules.css';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductSearch } from '../../slices/productSlice';

function SearchBar() {
  const [inputSearch, setInputSearch] = useState('');

  const history = useHistory();
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputSearch.length === 0 || inputSearch.trim().length === 0) {
      return;
    }
    dispatch(getProductSearch(inputSearch));
    history.push(`/catalogue`);
  };

  return (
    <div className="searchBar">
      <form
        onSubmit={onSubmit}
        className="SearchBar__form"
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-secondary"
          color="primary"
          label="Search"
          onChange={(e) => {
            setInputSearch(e.target.value);
          }}
        />
        <Button type="submit" className="SearchBar___btn" id="btnSB">
          Buscar
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;

// El componente Search Bar es un formulario conectado de un sólo input, al submitear ejecuta una función recibida por props con el texto ingresado.

// Notas: la función que recibe la vamos a utilizar en el futuro para disparar una acción de redux.
