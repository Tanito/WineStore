import React from 'react';
import InputField from './FieldComponents/InputField.jsx';
import TextareaField from './FieldComponents/TextareaField.jsx';
import SelectField from './FieldComponents/SelectField.jsx';
import CheckboxField from './FieldComponents/CheckboxField.jsx';
import SwitchField from './FieldComponents/SwitchField.jsx';
import RadioGroupField from './FieldComponents/RadioGroupField.jsx';
import DatePicker from './FieldComponents/DatePicker.jsx';

function FormField(props) {
  const { fieldType, ...rest } = props;
  switch (fieldType) {
    case 'input':
      return <InputField {...rest} />;
    case 'textarea':
      return <TextareaField {...rest} />;
    case 'select':
      return <SelectField {...rest} />;
    case 'checkbox':
      return <CheckboxField {...rest} />;
    case 'switch':
      return <SwitchField {...rest} />;
    case 'radio':
      return <RadioGroupField {...rest} />;
    case 'datepicker':
      return <DatePicker {...rest} />;
    default:
      return null;
  }
}

export default FormField;
