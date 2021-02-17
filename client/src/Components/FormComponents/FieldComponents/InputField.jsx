import { Field } from 'formik';
import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

function InputField({ name, label, disabled, minWidth, ...props }) {
  if (typeof label === 'undefined') label = name;
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: minWidth || label.length * 10 + 20,
    },
  }));
  const classes = useStyles();
  return (
    <div>
      <Field name={name}>
        {({ field, meta, form }) => (
          <TextField
            className={classes.formControl}
            disabled={disabled ?? form.isSubmitting}
            error={meta.touched && form.errors[name]}
            label={label}
            helperText={meta.touched && form.errors[name]}
            {...field}
            {...props}
          />
        )}
      </Field>
    </div>
  );
}

export default InputField;
