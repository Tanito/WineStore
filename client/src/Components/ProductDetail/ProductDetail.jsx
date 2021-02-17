import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  CardContent,
  CardActions,
  Card,
  Typography,
  Button,
  CircularProgress,
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';
import './ProductDetail.modules.css';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { postProductToCart, sync } from '../../slices/productsCartSlice';
import {
  allProductsCartStatusSelector,
  productDetailSelector,
  productDetailStatusSelector,
  reviewsListSelector,
  reviewsListStatusSelector,
  userSelector,
} from '../../selectors/index';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import ReviewCard from '../Review/ReviewCard';
import { average, functionCartGuest } from '../utils/index';
import { useAuthContext } from '../ProtectRoute/authContext';
import { setWineDetailAsync } from '../../slices/productDetailSlice';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function ProductDetail(props) {
  const authStatus = useAuthContext();

  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const detailStatus = useSelector(productDetailStatusSelector);
  const cartStatus = useSelector(allProductsCartStatusSelector);
  const productDetail = useSelector(productDetailSelector);
  const statusProductDetail = useSelector(productDetailStatusSelector);
  const reviews = useSelector(reviewsListSelector);
  const reviewStatus = useSelector(reviewsListStatusSelector);
  const history = useHistory();
  const classes = useStyles();

  //let value;

  const [value, setValue] = useState(0); // Rating traer promedio de calificación de base de datos según producto
  const [page, setPage] = useState(1);
  const cantidadAMostrar = 2;
  function handleClick(e, num) {
    setPage(num);
  }

  const {
    id,
    name,
    price,
    yearHarvest,
    description,
    image,
    stock,
    categories,
  } = productDetail;

  useEffect(() => {
    // if (typeof productDetail.id === 'undefined') {
    //   let fullUrl = location.pathname.split('/');
    //   let urlId = fullUrl.slice(fullUrl.length - 1);
    //   dispatch(setWineDetailAsync(urlId));
    // }
    if (reviewStatus === 'succeded' && reviews.length !== 0) {
      let rs = average(reviews);
      setValue(rs);
    }
  }, [reviewStatus]);

  useEffect(() => {
    if (typeof id === 'undefined') {
      let fullUrl = location.pathname.split('/');
      let urlId = fullUrl.slice(fullUrl.length - 1);
      dispatch(setWineDetailAsync(urlId));
      // history.push('/catalogue');
    }
  }, []);

  //* EDITHANDLER, redirect a form para editar producto
  const editHandler = () => {
    // dispatch(wineDetails(productDetail));
    // props.setProductDetail(wineDetail); //necesario en caso que ingrese al product detail sin pasar por catalogue.
    //Actualmente no es posible, pero podria ser una opcion en el futuro
    // dispatch(getAllCatsOfProduct(id));
    history.push(
      id
        ? {
            pathname: `/admin/edit/${id}`,
            state: {
              edit: true,
            },
          }
        : {
            pathname: '/catalogue',
            state: {
              edit: false,
            },
          }
    );
  };

  function handlerProductToCart(userId) {
    const payload = {
      id,
      price,
      detail: productDetail,
      quantity: 1,
      userId,
      increment: true,
    };
    dispatch(postProductToCart(payload));
  }

  function handlerProductToCartGuest(id) {
    // Carrito de guest en el local storage
    const payload = {
      id,
      price,
      name: productDetail.name,
      description: productDetail.description,
      stock: productDetail.stock,
      yearHarvest: productDetail.yearHarvest,
      image: productDetail.image,
      strainId: productDetail.strainId,
      quantity: 1,
    };

    functionCartGuest(payload, null, null);
    dispatch(sync(false));
  }
  let contentRev = [];
  if (reviews.length > 0) {
    contentRev = reviews
      .slice((page - 1) * cantidadAMostrar, page * cantidadAMostrar)
      .map((review) => {
        return <ReviewCard data={review} />;
      });
    contentRev.push(
      <div className="Catalogue__Pagination">
        <Pagination
          onChange={handleClick}
          count={Math.ceil(reviews.length / cantidadAMostrar)}
          variant="outlined"
          shape="rounded"
        />
      </div>
    );
  } else {
    contentRev = null;
  }

  if (reviewStatus === 'loading' || detailStatus === 'loading') {
    return (
      <div className="ProductDetail__containerCargando">
        <h3>Cargando....</h3>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container id="pageContainer" className="ProductDetail__Container">
      <Paper id="paper" className="ProductDetail__Paper">
        <div id="imgContainer">
          <img id="prodImg" src={image} alt={`imagen del vino ${name}`} />
        </div>
        <Card id="detailsContainer" className={classes.root} variant="outlined">
          <CardContent className="ProdDetail__CardText">
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {yearHarvest}
            </Typography>
            <Typography variant="h5" component="h2">
              {name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {categories}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              $ {price}
            </Typography>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
            <Box component="fieldset" mt={3} borderColor="transparent">
              <Rating value={value} readOnly />{' '}
              <div>{reviews.length} reviews</div>
            </Box>
          </CardContent>

          <CardActions id="buttons">
            <Button
              id="backButton"
              size="small"
              onClick={() => history.goBack()}
            >
              {' '}
              <img
                id="backButtonImage"
                src="https://static.thenounproject.com/png/251451-200.png"
                alt="backBtn"
              ></img>
              VOLVER
            </Button>
            {user && user.isAdmin ? (
              <>
                <Button size="small" onClick={editHandler}>
                  {' '}
                  <img
                    id="editImage"
                    src="https://download.tomtom.com/open/manuals/TomTom_GO_PREMIUM/html/es-mx/reordericons.png"
                    alt="editBtn"
                  ></img>
                  {/* <i class="fa fa-pencil-square-o" aria-hidden="true"></i> */}
                  EDITAR
                </Button>
              </>
            ) : null}
            {stock === 0 ? (
              <h3>No hay STOCK</h3>
            ) : (
              <Button
                id="Button__Buy"
                onClick={() => {
                  authStatus
                    ? handlerProductToCart(user.id)
                    : handlerProductToCartGuest(id);
                }}
                disabled={cartStatus === 'loading' ? true : false}
              >
                Comprar
              </Button>
            )}
          </CardActions>
          {contentRev}
        </Card>
      </Paper>
    </Container>
  );
}

export default ProductDetail;
