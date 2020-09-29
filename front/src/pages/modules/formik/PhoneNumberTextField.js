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
import PropTypes from 'prop-types';

import PhoneNumMask from '../components/PhoneNumMask';

const PhoneNumberTextField = (props) => {
  const {
    form: { setFieldValue },
    field: { name },
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

PhoneNumberTextField.propTypes = {
  form: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
};

export default PhoneNumberTextField;
