import React, {
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import {
  Clear,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import ModalBase from '../ModalBase';
import { formatAsCurrency } from '../../../../utils';
import { Context as StoreContext } from '../../../../context/storeContext';
import { Context as OrderContext } from '../../../../context/orderContext';

const PaymentModal = ({
  order,
  total,
  paySuccess,
  handleOpen,
  setOrderId,
  discount,
}) => {
  const { t } = useTranslation();
  const { storeState } = useContext(StoreContext);
  const { createOrder } = useContext(OrderContext);
  const paymentOptions = [
    total,
    1,
    2,
    5,
    10,
    20,
    50,
    100,
  ];
  const METHODS = {
    CASH: 'Cash',
    CARD: 'Card',
  };
  const [method, setMethod] = useState(METHODS.CASH); // methods: Cash, Card
  const [payment, setPayment] = useState(null);
  const [valid, setValid] = useState(false);
  const [paid, setPaid] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => (
    // watch payment set payment valid to true,
    // if payment >= total amount
    (payment >= total) ? setValid(true) : setValid(false)
  ), [payment]);

  const handlePayment = (paymentMethod) => {
    if (paymentMethod === METHODS.CARD) {
      setPayment(Number(total));
    } else {
      setPayment(0);
    }
    setMethod(paymentMethod);
  };

  const handleCancel = () => {
    handleOpen(false);
  };

  const handleCashAmount = (val) => {
    setPayment(payment + val);
  };

  const computeChange = () => {
    const change = total - payment;
    return change >= 0 ? '' : change;
  };

  const confirmPay = () => {
    const taxRate = storeState.tax.enable ? storeState.tax.rate : 0;
    const products = order.map((odr) => (
      {
        product: odr._id, price: odr.price, count: odr.count, cost: odr.cost,
      }
    ));

    const submitOrder = {
      paymentType: method,
      amountPaid: payment,
      products,
      taxRate,
      discount,
    };
    createOrder(
      submitOrder,
      (oid) => {
        setOrderId(oid);
        setPaid(true);
      },
      () => {
        addToast('Unable to save current order.', { appearance: 'error' });
      },
    );
  };

  const handleDone = () => {
    paySuccess();
    handleCancel();
  };

  return (
    <ModalBase
      title={t('pay.payment')}
      className="payment-modal"
      content={
        <>
          {
            paid ? (

              <>
                <div className="paid-btns">
                  <Button
                    onClick={() => window.print()}
                    variant="contained"
                  >
                    { t('pay.printReceipt') }
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleDone}
                  >
                    { t('common.done') }
                  </Button>
                </div>
              </>
            ) : (
              <div className="container">
                <div className="left">
                  <Button
                    color={method === METHODS.CASH ? 'primary' : 'default'}
                    variant="contained"
                    onClick={() => handlePayment(METHODS.CASH)}
                  >
                    { t('pay.cash') }
                  </Button>
                  <Button
                    color={method === METHODS.CARD ? 'primary' : 'default'}
                    variant="contained"
                    onClick={() => handlePayment(METHODS.CARD)}
                  >
                    { t('pay.card') }
                  </Button>
                </div>
                <div className="right">
                  {
                    payment === null ? (
                      <div className="due">
                        <div className="label">{ t('pay.paymentDue') }</div>
                        <div className="value">
                          +
                          {formatAsCurrency(total)}
                        </div>
                      </div>
                    ) : (
                      <div className="payments">
                        <div className="header row">
                          <div className="due">
                            <Typography variant="subtitle2">
                              { t('pay.due') }
                            </Typography>
                          </div>
                          <div className="paid">
                            <Typography variant="subtitle2">
                              { t('pay.paid') }
                            </Typography>
                          </div>
                          <div className="change">
                            <Typography variant="subtitle2">
                              { t('pay.change') }
                            </Typography>
                          </div>
                          <div className="method">
                            <Typography variant="subtitle2">
                              { t('pay.method') }
                            </Typography>
                          </div>
                        </div>
                        <div className="row">
                          <div className="due">
                            { formatAsCurrency(total) }
                          </div>
                          <div className="paid">
                            <CurrencyTextField
                              value={payment}
                              onChange={(e, val) => setPayment(val)}
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
                                      <Clear />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                                inputProps: {
                                  min: 0,
                                },
                              }}
                            />
                          </div>
                          <div className="change">
                            {
                              computeChange() === '' ? (
                                ''
                              ) : (
                                formatAsCurrency(computeChange())
                              )
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
                    )
                  }
                  <div className="quick-payments">
                    {
                      method === METHODS.CASH && (
                        paymentOptions.map((payOpt) => (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCashAmount(Number(payOpt))}
                            key={payOpt}
                          >
                            +
                            $
                            { Number(payOpt.toFixed(2))}
                          </Button>
                        ))
                      )
                    }
                  </div>
                </div>
              </div>
            )
          }
        </>
      }
      actions={
        <>
          {
            !paid && (
              <>
                <div className="whitespace" />
                <div className="btns">
                  <Button
                    variant="contained"
                    onClick={handleCancel}
                  >
                    { t('common.cancel') }
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={!valid}
                    onClick={confirmPay}
                  >
                    { t('common.confirm') }
                  </Button>
                </div>
              </>
            )
          }
        </>
      }
    />
  );
};

PaymentModal.propTypes = {
  order: PropTypes.instanceOf(PropTypes.object).isRequired,
  total: PropTypes.number.isRequired,
  paySuccess: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  setOrderId: PropTypes.func.isRequired,
  discount: PropTypes.func.isRequired,
};

export default PaymentModal;
