import React from 'react';
import {
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  FormHelperText,
} from '@material-ui/core';
import { Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

function SelectField({
  name,
  label,
  options,
  InputLabelProps,
  SelectProps,
  disabled,
  required,
  minWidth,
  placeholder,
  ...props
}) {
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
        {({ field, meta, form }) => {
          return (
            <FormControl
              className={classes.formControl}
              error={meta.touched && !!form.errors[name]}
            >
              {label && (
                <InputLabel shrink={placeholder && true} {...InputLabelProps}>
                  {label}
                </InputLabel>
              )}
              <Select
                value={field.value}
                displayEmpty={placeholder && true}
                disabled={disabled ?? form.isSubmitting}
                {...SelectProps}
                {...field}
                {...props}
              >
                {
                  placeholder &&         
                   <MenuItem value="">
                  <em>{placeholder}</em>
                </MenuItem>
                }
                {placeholder ||
                  (!options && (
                    <MenuItem value="" disabled>
                      <em>{placeholder || `No hay ${name}s cargadas`}</em>
                    </MenuItem>
                  ))}
                {options &&
                  options.map((option, idx) => (
                    <MenuItem key={idx} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{form.errors[name]}</FormHelperText>
            </FormControl>
          );
        }}
      </Field>
    </div>
  );
}

export default SelectField;
