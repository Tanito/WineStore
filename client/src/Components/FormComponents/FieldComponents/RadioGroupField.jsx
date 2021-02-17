import React from 'react';
import { Field } from 'formik';
import {
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormHelperText,
} from '@material-ui/core';

function RadioGroupField({
  name,
  label,
  labelPlacement,
  options,
  radioProps,
  ...props
}) {
  const handleChange = (e) => {
    console.log(e);
  };

  return (
    <Field name={name}>
      {({ field, meta, form }) => {
        return (
          <FormControl
            name={name}
            component="fieldset"
            error={form.errors && form.errors[name]}
          >
            {/* {console.log('FIELD', field, 'META', meta, 'FORM', form)} */}
            <RadioGroup {...field} {...props}>
              {options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  label={option.label}
                  value={option.value}
                  control={<Radio {...radioProps} />}
                  labelPlacement={labelPlacement || 'start'}
                  onChange={handleChange}
                />
              ))}
            </RadioGroup>
            <FormHelperText>{form.errors && form.errors[name]}</FormHelperText>
          </FormControl>
        );
      }}
    </Field>
  );
}

export default RadioGroupField;
