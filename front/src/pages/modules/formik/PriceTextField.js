import React, {
  useCallback,
} from 'react';
import {
  fieldToTextField,
} from 'formik-material-ui';
import PropTypes from 'prop-types';

import CurrencyTextField from '@unicef/material-ui-currency-textfield';

const PriceTextField = (props) => {
  const {
    form: { setFieldValue },
    field: { name },
  } = props;
  const onChange = useCallback(
    (event, value) => {
      setFieldValue(name, value);
    },
    [setFieldValue, name],
  );
  return <CurrencyTextField {...fieldToTextField(props)} onChange={onChange} />;
};

PriceTextField.propTypes = {
  form: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
};

export default PriceTextField;
