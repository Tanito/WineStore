import React from 'react';
import {
  makeStyles,
  useTheme,
  MobileStepper,
  Paper,
  Typography,
  Button,
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import './Carrousel.modules.css';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  {
    imgPath:
      'https://ibiza.vilavins.com/images/blog/el-mundo-del-vino/la-ciencia-en-tu-copa/guardar-o-abrir/reliquias-del-almacen.jpg',
  },
  {
    imgPath:
      'https://ibiza.vilavins.com/images/blog/el-mundo-del-vino/la-ciencia-en-tu-copa/guardar-o-abrir/conservacion-del-vino.jpg',
  },
  {
    imgPath:
      'https://ibiza.vilavins.com/images/blog/el-mundo-del-vino/la-ciencia-en-tu-copa/guardar-o-abrir/el-envejecimiento.jpg',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: '23vw',
    display: 'block',
    overflow: 'hidden',
    width: '100%',
  },
}));

function Carrousel() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    //Manejador de la próxima imágen del carrusel
    if (activeStep === 2) {
      setActiveStep((prevActiveStep) => (prevActiveStep = 0));
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    //Manejador de la imágen previa del carrusel
    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => (prevActiveStep = 2));
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    //Renderizado del carrusel de imágenes
    <div className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography>{tutorialSteps[activeStep].label}</Typography>
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {tutorialSteps.map((step, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img
                className={classes.img}
                src={step.imgPath}
                alt={step.label}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={
          <Button size="small" className="color__cremita" onClick={handleNext}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" className="color__cremita" onClick={handleBack}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </div>
  );
}

export default Carrousel;
