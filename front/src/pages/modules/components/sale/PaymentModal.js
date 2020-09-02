import React, {
  useState,
  useEffect,
} from 'react';
import {
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import {
  Clear
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import ModalBase from '../ModalBase';
import { formatAsCurrency } from '../../../../utils';

const PaymentModal = ({ order, total, handlePay, handleOpen }) => {
  const { t } = useTranslation();
  const paymentOptions = [
    total,
    5,
    10,
    20,
    50,
    100
  ];
  const METHODS = {
    CASH: 'Cash',
    CARD: 'Card',
  }
  const [method, setMethod] = useState(METHODS.CASH); // methods: Cash, Card
  const [payment, setPayment] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // watch payment set payment valid to true,
    // if payment >= total amount
    if (payment >= total) {
      if (!valid) {
        setValid(true);
      }
    } else {
      if (valid) {
        setValid(false);
      }
    }
  }, [payment]);

  const handlePayment = (method) => {
    if (method === METHODS.CARD) {
      setPayment(Number(total));
    } else {
      setPayment(0);
    }
    setMethod(method);
  }

  const handleCancel = () => {
    handleOpen(false);
  }

  const handleCashAmount = (val) => {
    setPayment(payment + val);
  }

  const computeChange = () => {
    const change = total - payment;
    return change >= 0 ? '' : change; 
  }

  return (
    <ModalBase
      title="Payment"
      className="payment-modal"
      content={
        <div className="container">
          <div className="left">
            <Button
              color={method === METHODS.CASH ? 'primary' : ''}
              variant={method === METHODS.CASH ? 'contained' : ''}
              onClick={() => handlePayment(METHODS.CASH)}
            >
              Cash
            </Button>
            <Button
              color={method === METHODS.CARD ? 'primary' : ''}
              variant={method === METHODS.CARD ? 'contained' : ''}
              onClick={() => handlePayment(METHODS.CARD)}
            >
              Card
            </Button>
          </div>
          <div className="right">
            {
              payment === null ?
              <div className="due">
                <div className="label">Payment Due</div>
                <div className="value">+{ formatAsCurrency(total) }</div>
              </div>
              :
              <div className="payments">
                <div className="header row">
                  <div className="due">
                    <Typography variant="subtitle2">
                      Due
                    </Typography>
                  </div>
                  <div className="paid">
                    <Typography variant="subtitle2">
                      Paid
                    </Typography>
                  </div>
                  <div className="change">
                    <Typography variant="subtitle2">
                      Change
                    </Typography>
                  </div>
                  <div className="method">
                    <Typography variant="subtitle2">
                      Method
                    </Typography>
                  </div>
                </div>
                <div className="row">
                  <div className="due">
                    { formatAsCurrency(total) }
                  </div>
                  <div className="paid">
                    <TextField
                      type="number"
                      value={payment}
                      onChange={e => setPayment(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setPayment(0)}
                            >
                              <Clear/>
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </div>
                  <div className="change">
                    {
                      computeChange() === '' ?
                      ''
                      :
                      formatAsCurrency(computeChange()) 
                    }
                  </div>
                  <div className="method">
                    { method }
                  </div>
                </div>
                <div className="amount-own-row">
                  <Typography variant="subtitle2">
                    { formatAsCurrency(total - payment) }
                  </Typography>
                </div>
              </div>
            }
            <div className="quick-payments">
              {
                method === METHODS.CASH ?
                paymentOptions.map(payment => (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCashAmount(Number(payment))}
                    key={payment}
                  >
                    + ${ payment }
                  </Button>
                ))
                :
                null
              }
            </div>
          </div>
        </div>
      }
      actions={
        <React.Fragment>
          <div className="whitespace"/>
          <div className="btns">
            <Button 
              onClick={handleCancel}
            >
              { t('common.cancel') }
            </Button>
            <Button
              disabled={!valid}
            >
              Print Receipt
            </Button>
            <Button
              disabled={!valid}
            >
              { t('common.confirm') }
            </Button>
          </div>
        </React.Fragment>
      }
    />
  );
}

export default PaymentModal;
