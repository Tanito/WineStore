import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { Field } from 'formik';

function CheckboxField({
  name,
  label,
  labelPlacement,
  disabled,
  icon,
  ...props
}) {
  return (
    <div>
      <Field name={name}>
        {({ form, field, meta }) => {
          return (
            <FormControlLabel
              value={name}
              label={label}
              labelPlacement={labelPlacement || 'start'}
              control={
                <Checkbox
                  type="checkbox"
                  disabled={disabled ?? form.isSubmitting}
                  {...field}
                  {...props}
                />
              }
            />
          );
        }}
      </Field>
    </div>
  );
}

export default CheckboxField;
