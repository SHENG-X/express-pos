import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import ModalBase from '../ModalBase';

const DiscountModal = ({ discountProp, handleOpen, handleConfirm }) => {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState({
    type: 'Amount',
    value: 0
  });

  useEffect(() => {
    if (discountProp) {
      setDiscount({...discountProp, value: discountProp.type === 'Percent' ? discountProp.value * 100 : discountProp.value });
    }
  }, []);

  return (
    <ModalBase
      title={ 'Discount' }
      className="discount-modal"
      content={
        <React.Fragment>
          <div className="flex">
            <div className="flex flex-col left">
              <Button
                variant="contained"
                color={discount.type === 'Amount' ? 'primary' : 'default'}
                onClick={() => setDiscount({ ...discount, type: 'Amount', value: 0 })}
              >
                Cash
              </Button>
              <Button
                variant="contained"
                color={discount.type === 'Percent' ? 'primary' : 'default'}
                onClick={() => setDiscount({ ...discount, type: 'Percent', value: 0 })}
              >
                Percent
              </Button>
            </div>
            <div className="right">
            {
              discount.type === 'Amount' &&
              <TextField
                type="number"
                value={discount.value}
                onChange={e => setDiscount({ ...discount, value: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            }
            {
              discount.type === 'Percent' &&
              <TextField
                type="number"
                value={discount.value}
                onChange={e => setDiscount({ ...discount, value: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      %
                    </InputAdornment>
                  )
                }}
              />
            }
            </div>
          </div>
        </React.Fragment>
      }
      actions={
        <React.Fragment>
          <Button
            variant="contained"
            onClick={() => handleOpen(false)}
          >
            { t('common.cancel') }
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleConfirm({ ...discount, value: discount.type === 'Percent' ? discount.value / 100 : discount.value })}
          >
            { t('common.confirm') }
          </Button>
        </React.Fragment>
      }
    />
  );
}

export default DiscountModal;
