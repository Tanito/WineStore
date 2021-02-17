import { Button, Paper } from '@material-ui/core';
import { Formik, Form } from 'formik';
import React from 'react';
import FormField from './FormField.jsx';
import { validationSchema } from './validations';
import './TestForm.modules.css';

const initialValues = {
  product: '',
  cellar: '',
  strain: '',
  wine_types: '',
  isPremium: false,
  bday: new Date('1988-03-22'),
};
const wine_types = [
  {
    label: 'Red',
    value: 'tinto',
  },
  {
    label: 'White',
    value: 'blanco',
  },
  {
    label: 'Blend',
    value: 'blend',
  },
];
const strains = [
  {
    label: 'Pinot Noir',
    value: 'pinot',
  },
  {
    label: 'Malbec',
    value: 'malbec',
  },
  {
    label: 'Carmenere',
    value: 'carmenere',
  },
  {
    label: 'Syrah',
    value: 'syrah',
  },
  {
    label: 'Blend',
    value: 'red_bled',
  },
];

function Test() {
  const handleSubmit = (values, onSubmitProps) => {
    setTimeout(() => {
      onSubmitProps.resetForm();
    }, 2000);
  };

  //! Para armar un formulario es necesario:
  //Envolver todo con el tag <Formik>, y pasar dentro de este los:
  //*initialValues={VARIABLE_CON_VALORES_INICIALES}; objeto con los valores iniciales de cada Field del form
  //*validationSchema={VARIABLE_CON_EL_ESQUEMA_DE_VALIDACION}; objeto con forma identica a `initialValues`,
  //*las validaciones se hacen contra este objeto `yup`
  //*onSubmit={FUNC_PARA_MANEJAR_EL_SUBMIT}; cualquier funcion a ejecutar con los datos del form, la func onSubmit,
  //*ademas de recibir `values` como parametro, tambien recibe una callback func `onSubmitProps`, con los siguientes metodos:
  //*setSubmitting(`true||false`)->setea el submitting state del form (util para evitar doble envio, etc.)
  //*resetForm()->limpia el formulario, llamar al final para `resetear` el form.

  //Entre los tags de <Formik> llamar una Arrow Func, pasandole el parametro (formik), y devolver:
  //un <Form> de formik, dentro de los tags de <Form> vamos a llamara todos los <FormField>
  //Se pueden utilizar los botones de MUI directamente,
  //para el boton de submit es necesario definir el `type='submit'`
  //Es buena practica deshabilitar el boton `submit` si hay errores,
  //para eso, agregar como prop: `disabled={!formik.isValid}`
  //Pueden agregarse otros botones, ligados c/u a su handlerFunc

  //* Parametros <<obligatorios>> a pasar a <FormField/>:
  //? fieldType: Un string que tiene el tipo de campo que queremos renderizar, puede ser:
  //? ['input','`validateinput`',textarea','switch','select','checkbox','radio','`datepicker`','`uploader`','`groupCheckBox`',`'groupSwitch'`]
  //? label: Un string que sera el label del campo
  //? name: Un string que sera el nombre de referencia para el Field. `name` es la propiedad que permite
  //? enlazar los objetos `errors`, `touched`,`validations` (de yup). Entonces:
  //? `initialValues.name === validationSchema.name === FormField.name`
  //? Para los fieldType=['select','groupcheckbox','radio','groupswitch'] es necesario pasar
  //? una prop adicional `options`, con un array de objetos de la forma:
  //? [{label:'LABEL_TO_SHOW'},value:'VALUE_TO_USE/STORE'},...{}]
  //?  `value` es el parametro que se utiliza para las validaciones de los campos.
  //? Para los `pickers`, si se desea pasar un default value debe ser a traves
  //? de los initialvalues, para las fechas, es necesario definir:
  //? `new Date('yyyy-MM-dd')` siguiendo el formato año, mes, dia.

  //* Parametros <<opcionales>> a pasar a <FormField/>:
  //? Todos los parametros opcionales que pueden pasarse a un Field de MUI, del mismo tipo a renderizar,
  //? pueden ser pasados como props adicionales.
  //? Algunas props complejas, que renderizan jsx adiciona, como `startAdornment` o
  //?`endAdornment` no pueden pasarse directamente, deben pasarse a traves de:
  //? 'InputProps', por ej.: ...InputProps={{startAdornment:("JSX"),... }}
  //? Importante el doble juego de llaves, `{{}}`

  //Proceso de submit:
  //1. `field.touched=true` para todos los fields con `initialValues` [!IMPORTANTE SETEAR TODOS LOS initialValues]
  //2. `setSubmitting=true`, se puede acceder a esta func desde onSubmitProps
  //3. `submitCount+=1`, se incrementa submitCount, tambien se puede acceder desde onSubmitProps
  //4. `isValidating=true`. Se corren todas las validaciones `field-level` y las validaciones del
  //`validationSchema` de forma asincrona
  // 4.1. Si hay un Error de validacion, `isValidating=false`, `errors.name=ERROR_NAME` y `isSubmiting=false`
  // 4.2 Si NO hay error, `isValidating=false` y se procede al submit.
  //5. Corre el codigo del submit handler

  return (
    <Paper className="TestForm">
      <h3>TEST FORM ONE OF EACH</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div>
              <FormField
                fieldType="textarea"
                label="Product"
                name="product"
                rows={5}
              />
              <FormField fieldType="input" label="Cellar" name="cellar" />
              <FormField
                fieldType="select"
                label="Strain"
                name="strain"
                options={strains}
                value={strains[0].value}
              />
              <FormField
                fieldType="switch"
                label="Is Premium"
                name="isPremium"
                color="primary"
              />
              <FormField
                fieldType="radio"
                label="Wine Types"
                name="wine_types"
                options={wine_types}
              />
              <FormField fieldType="datepicker" label="birth day" name="bday" />
            </div>
            <br></br>
            <div>
              <Button
                variant="contained"
                color="secondary"
                disabled={!formik.isValid}
                type="submit"
              >
                {' '}
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}

export default Test;
