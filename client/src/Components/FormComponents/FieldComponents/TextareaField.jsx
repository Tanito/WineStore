import { Field } from 'formik';
import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

function TextareaField({ name, label, minWidth, ...props }) {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: minWidth || label.length * 10 + 30,
    },
  }));
  const classes = useStyles();
  return (
    <div>
      <Field name={name}>
        {({ field, meta, form }) => (
          <TextField
            className={classes.formControl}
            error={meta.touched && form.errors[name]}
            label={label}
            variant="outlined"
            multiline
            helperText={meta.touched && form.errors[name]}
            {...field}
            {...props}
          />
        )}
      </Field>
    </div>
  );
}

export default TextareaField;
