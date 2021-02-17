import React from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';
import { Field } from 'formik';

function SwitchField({ name, label, labelPlacement, disabled, ...props }) {
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
                <Switch
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

export default SwitchField;
