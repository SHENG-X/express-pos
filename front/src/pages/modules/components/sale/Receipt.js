import React, {
  useContext,
  useState,
} from 'react';
import {
  IconButton,
  Button,
  Typography,
} from '@material-ui/core';
import {
  Delete
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import PaymentModal from './PaymentModal';
import { Context } from '../../../../context/storeContext';
import { formatAsCurrency } from '../../../../utils';

const Receipt = ({ order, setOrder }) => {
  const { state, createOrder } = useContext(Context);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const deleteProduct = (product) => {
    const newProducts = order.filter(prod => {
      if (prod._id === product._id && prod.price === product.price) {
        return null;
      } else {
        return prod;
      }
    });
    setOrder(newProducts.filter(prod => prod !== null));
  }

  const calcSubtotal = () => {
    return order.reduce((res, prod) => res += prod.count * prod.price, 0).toFixed(2);
  }

  const calcTax = () => {
    return (state.store.tax.rate * Number(calcSubtotal())).toFixed(2);
  }

  const calcTotal = () => {
    if (state.store.tax.enable) {
      return (Number(calcSubtotal()) + Number(calcTax())).toFixed(2);
    }
    return Number(calcSubtotal()).toFixed(2);
  }

  const cancelOrder = () => {
    setOrder([]);
  }

  const placeOrder = () => {
    const products = order.map(prod => ({
      product: prod._id,
      price: prod.price,
      count: prod.count
    }));
    const orderData = {
      store: state.store._id,
      products: products,
    };
    createOrder(orderData, () => {
      setOrder([]);
    });
  }

  const proceedPay = () => {
    if (order.length) {
      setOpen(true);
    }
  }

  return (
    <React.Fragment>
      <div className="container">
        <div className="list">
          <React.Fragment>
            { order.map(prod => <ReceiptItem product={prod} deleteProduct={deleteProduct} key={prod._id}/>) }
          </React.Fragment>
          <React.Fragment>
            {
              order.length ? 
              <div className="summary">
                <div className="separator"/>
                {
                  state.store.tax.enable ?
                  <React.Fragment>
                    <div className="subtitle">
                      <div className="label">
                        <Typography variant="body1">
                          { t('sale.subtotal') }
                        </Typography>
                      </div>
                      <div className="amount">
                        { formatAsCurrency(calcSubtotal()) }
                      </div>
                    </div>
                    <div className="tax">
                      <div className="label">
                        <Typography variant="body1">
                          { t('tax.taxRate') } { `${state.store.tax.rate * 100}%` }
                        </Typography>
                      </div>
                      <div className="amount">
                        { formatAsCurrency(calcTax()) }
                      </div>
                    </div>
                  </React.Fragment>
                  :
                  null
                }
                <div className="total">
                  <div className="label">
                    <Typography variant="h6">
                      { t('sale.total') }
                    </Typography>
                  </div>
                  <div className="amount">
                    <Typography variant="h6">
                      { formatAsCurrency(calcTotal()) }
                    </Typography>
                  </div>
                </div>
              </div>
              :
              <EmptyCart/>
            }
          </React.Fragment>
        </div>
        <div className="controller">
          <Button
            onClick={cancelOrder}
          >
            Cancel
          </Button>
          <Button onClick={proceedPay}>
            Pay
          </Button>
        </div>
      </div>
      {
        open ? 
        <PaymentModal order={order} total={calcTotal()} handlePay={() => {}} handleOpen={(val) => setOpen(val)}/>
        :
        null
      }
    </React.Fragment>
  );
}

const ReceiptItem = ({ product, deleteProduct }) => {

  return (
    <div className="receipt-row">
      <div className="title">
        <div className="left">
          <Typography variant="subtitle2">
            { product.name }
          </Typography>
        </div>
        <div className="right">
          <div className="amt">
            <Typography variant="subtitle2">
              { formatAsCurrency(product.count * product.price) }
            </Typography>
          </div>
          <div className="del">
            <IconButton
              color="primary"
              size="small"
              aria-label="delete"
              onClick={() => deleteProduct(product) }
            >
              <Delete />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="subtitle">
        <Typography variant="caption">
          { product.count } x { formatAsCurrency(product.price) }
        </Typography>
      </div>
    </div>
  );
}

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <img
        src={require('../../../../static/supermarket.svg')}
      />
      <Typography variant="body1">
        Your shopping cart is empty.
      </Typography>
    </div>
  );
}

export default Receipt;