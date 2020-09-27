import React, {
  useCallback,
} from 'react';
import {
  fieldToTextField,
} from 'formik-material-ui';
import {
  Input,
  FormHelperText,
} from '@material-ui/core';

import PhoneNumMask from '../components/PhoneNumMask';

const PhoneNumberTextField = (props) => {
  const {
    form: {setFieldValue},
    field: {name},
  } = props;
  const onChange = useCallback(
    (event) => {
      const { value } = event.target;
      setFieldValue(name, value ? value.toLowerCase() : '');
    },
    [setFieldValue, name],
  );

  const textFieldProps = fieldToTextField(props);
  return (
    <>
      <Input inputComponent={PhoneNumMask} {...fieldToTextField(props)} onChange={onChange} />
      {
        textFieldProps.error && (
          <FormHelperText error>
            { textFieldProps.helperText }
          </FormHelperText>
        )
      }
    </>
  );
};

export default PhoneNumberTextField;
