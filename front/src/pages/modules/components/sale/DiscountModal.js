import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  InputAdornment,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  TextField,
} from 'formik-material-ui';

import ModalBaseV2 from '../ModalBaseV2';
import PriceTextField from '../../formik/PriceTextField';

const DiscountModal = ({ discountProp, handleOpen, handleConfirm, total }) => {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState({
    method: 'Amount',
    value: '',
  });

  useEffect(() => {
    if (discountProp) {
      setDiscount({ ...discountProp, value: discountProp.method === 'Percent' ? discountProp.value * 100 : discountProp.value });
    }
  }, []);

  return (
    <ModalBaseV2
      title="Discount"
      className="discount-modal"
    >
      <Formik
        initialValues={{...discount}}
        onSubmit={(values) => {
          handleConfirm({ ...values, value: values.method === 'Percent' ? values.value / 100 : values.value })
        }}
        validate={(values) => {
          const errors = {};
          const discountAmount = values.method === 'Percent' ? values.value / 100 : values.value; 
          if (discountAmount > total) {
            errors.value = "You can not discount more than the total amount";
          }
          return errors;
        }}
        enableReinitialize
      >
        {({ submitForm }) => (
          <Form autocomplete="off">
            <div className="flex content">
              <div className="flex flex-col left">
                <Button
                  variant="contained"
                  color={discount.method === 'Amount' ? 'primary' : 'default'}
                  onClick={() => setDiscount({ ...discount, method: 'Amount', value: '' })}
                >
                  Cash
                </Button>
                <Button
                  variant="contained"
                  color={discount.method === 'Percent' ? 'primary' : 'default'}
                  onClick={() => setDiscount({ ...discount, method: 'Percent', value: '' })}
                >
                  Percent
                </Button>
              </div>
              <div className="right">
                {
                  discount.method === 'Amount' && (
                    <Field
                      component={PriceTextField}
                      name="value"
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                    />
                  )
                }
                {
                  discount.method === 'Percent' && (
                    <Field
                      component={TextField}
                      name="value"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            %
                          </InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                        },
                      }}
                    />
                  )
                }
              </div>
            </div>
            <div className="actions">
              <Button
                variant="contained"
                onClick={() => handleOpen(false)}
              >
                { t('common.cancel') }
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={submitForm}
              >
                { t('common.confirm') }
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalBaseV2>
  );
};

DiscountModal.propTypes = {
  discountProp: PropTypes.instanceOf(PropTypes.object).isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default DiscountModal;
