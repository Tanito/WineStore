import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Container,
  Paper,
  Button,
  Link,
  Box,
  ListItemIcon,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import { userSelector, allProductsSelector } from '../../../selectors/index';
import { useDispatch, useSelector } from 'react-redux';
import Usuarios from './Usuarios';
import Logo from './Logo';
import OrderTable from '../../OrderTable/OrderTable';
import AdminStrain from '../LoadCategory/AdminStrain';
import AdminCategory from '../LoadCategory/AdminCategory';
import AdminProduct from './Products';
import './Dashboard.modules.css';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Wine Store
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  display: 'flex',
}));

export default function Dashboard() {
  const classes = useStyles();
  const [menu, setMenu] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const products = useSelector(allProductsSelector);

  const [state, setState] = useState({
    dispatched: true,
    canceled: true,
    pending: true,
    completed: true,
    cart: true,
    finished: true,
  });
  const { cart, canceled, completed, dispatched, pending, finished } = state;

  const handleOnClick = (e) => {
    setMenu(parseInt(e.target.value));
    return;
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  function getMenu(menu) {
    switch (menu) {
      case 0:
        return <Logo />;
      case 1:
        return <OrderTable states={state} />;
      case 2:
        return <Usuarios />;
      case 3:
        return <AdminProduct />;
      case 4:
        return <AdminCategory />;
      case 5:
        return <AdminStrain />;
      default:
        return <Logo />;
    }
  }

  useEffect(() => {
    {
      getMenu(menu);
    }
  }, [menu]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div id="dashboard">
      <Paper id="lateral">
        <Button value="0" className="list" button onClick={handleOnClick}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          Panel Admin
        </Button>
        <div id="ordersFilter">
          <Button value="1" className="list" button onClick={handleOnClick}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            Ordenes
          </Button>
          <div id="checkbox">
            {menu === 1 ? (
              <FormControl>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="checkbox"
                        checked={dispatched}
                        onChange={handleChange}
                        name="dispatched"
                      />
                    }
                    label="Dispatched"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="checkbox"
                        checked={canceled}
                        onChange={handleChange}
                        name="canceled"
                      />
                    }
                    label="Canceled"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="checkbox"
                        checked={cart}
                        onChange={handleChange}
                        name="cart"
                      />
                    }
                    label="Cart"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="checkbox"
                        checked={pending}
                        onChange={handleChange}
                        name="pending"
                      />
                    }
                    label="Pending"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="checkbox"
                        checked={completed}
                        onChange={handleChange}
                        name="completed"
                      />
                    }
                    label="Completed"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="checkbox"
                        checked={finished}
                        onChange={handleChange}
                        name="finished"
                      />
                    }
                    label="Finished"
                  />
                </FormGroup>
              </FormControl>
            ) : null}
          </div>
        </div>
        <Button value="2" className="list" button onClick={handleOnClick}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          Usuarios
        </Button>
        <Button value="3" className="list" button onClick={handleOnClick}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          Productos
        </Button>
        <Button value="4" className="list" button onClick={handleOnClick}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          Categorías
        </Button>
        <Button value="5" className="list" button onClick={handleOnClick}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          Cepas
        </Button>
      </Paper>

      <div id="menu">
        {/* <main> */}
        {/* <div /> */}
        <Container>
          <Paper>{getMenu(menu)}</Paper>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
        {/*  </main> */}
      </div>
    </div>
  );
}
