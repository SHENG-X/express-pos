import React, {
  useCallback,
} from 'react';
import {
  fieldToTextField,
} from 'formik-material-ui';
import {
  TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const IntegerTextField = (props) => {
  const {
    form: { setFieldValue },
    field: { name },
  } = props;
  const onChange = useCallback(
    (event) => {
      const { value } = event.target;
      setFieldValue(name, value ? value.replace(/\./g, '') : '');
    },
    [setFieldValue, name],
  );
  return (
    <TextField
      {...fieldToTextField(props)}
      type="number"
      step="1"
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.keyCode === 190) {
          e.preventDefault();
        }
      }}
    />
  );
};

IntegerTextField.propTypes = {
  form: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
};

export default IntegerTextField;
