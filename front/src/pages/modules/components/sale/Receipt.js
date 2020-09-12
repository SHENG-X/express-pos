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
import DiscountModal from './DiscountModal';
import PrintableReceipt from './PrintableReceipt';
import { Context } from '../../../../context/storeContext';
import { formatAsCurrency, classNames } from '../../../../utils';

const Receipt = ({ order, setOrder }) => {
  const { storeState } = useContext(Context);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discount, setDiscount] = useState(null);

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
    let subtotal = order.reduce((res, prod) => res += prod.count * prod.price, 0);
    if (discount) {
      if (discount.method === 'Amount') {
        subtotal -= discount.value;
      } else {
        // discount type Percent
        subtotal *= (1 - discount.value);
      }
    }
    return subtotal.toFixed(2);
  }

  const calcDiscount = () => {
    if (!discount) {
      return;
    }
    if (discount.method === 'Amount') {
      return discount.value * -1;
    }
    const subtotal = order.reduce((res, prod) => res += prod.count * prod.price, 0);
    return subtotal * discount.value * -1;
  }

  const calcTax = () => {
    return (storeState.tax.rate * Number(calcSubtotal())).toFixed(2);
  }

  const calcTotal = () => {
    if (storeState.tax.enable) {
      return (Number(calcSubtotal()) + Number(calcTax())).toFixed(2);
    }
    return Number(calcSubtotal()).toFixed(2);
  }

  const cancelOrder = () => {
    setOrder([]);
    setOrderId(null);
    setDiscount(null);
  }

  const proceedPay = () => {
    if (order.length) {
      setOpen(true);
    }
  }

  const handleAddDiscount = (discount) => {
    setDiscount(discount);
    setDiscountOpen(false);
  }

  return (
    <React.Fragment>
      <div className="container">
        <div className="list">
          <React.Fragment>
            { order.map(prod => <ReceiptItem product={prod} deleteProduct={deleteProduct} key={`${prod._id}-${prod.price}`}/>) }
          </React.Fragment>
          <React.Fragment>
            <div className="summary">
              <div className={classNames(['separator', order.length ? '' : 'hidden'])}/>
                <React.Fragment>
                  <div className={classNames(['subtotal', order.length && storeState.tax.enable ? '' : 'hidden'])}>
                    <div className="label">
                      <Typography variant="body1">
                        { t('sale.subtotal') }
                      </Typography>
                    </div>
                    <div className="amount">
                      { formatAsCurrency(calcSubtotal()) }
                    </div>
                  </div>
                  <div className={classNames(['discount', discount && discount.value > 0 ? '' : 'hidden'])}>
                    <div className="label">
                      <Typography variant="body1">
                        Discount { discount && discount.method === 'Percent' ? `${discount.value * 100}%` : '' }
                      </Typography>
                    </div>
                    <div className="amount">
                      { formatAsCurrency(calcDiscount()) }
                    </div>
                  </div>
                  <div className={classNames(['tax', order.length && storeState.tax.enable ? '' : 'hidden'])}>
                    <div className="label">
                      <Typography variant="body1">
                        { t('tax.taxRate') } { `${storeState.tax.rate * 100}%` }
                      </Typography>
                    </div>
                    <div className="amount">
                      { formatAsCurrency(calcTax()) }
                    </div>
                  </div>
                </React.Fragment>
              <div className={classNames(['total', order.length ? '' : 'hidden'])}>
                <div className="label">
                  <Typography variant="h6">
                    { t('sale.totalAmount') }
                  </Typography>
                </div>
                <div className="amount">
                  <Typography variant="h6">
                    { formatAsCurrency(calcTotal()) }
                  </Typography>
                </div>
              </div>
            </div>
            <EmptyCart className={`${order.length ? 'hidden' : ''}`}/>
          </React.Fragment>
        </div>
        <div className="controller">
          <Button
            variant="contained"
            onClick={cancelOrder}
          >
            { t('common.cancel') }
          </Button>
          <Button
            variant="contained"
            onClick={() => setDiscountOpen(order.length ? true : false)}
          >
            Discount
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={proceedPay}
          >
            { t('pay.title') }
          </Button>
        </div>
      </div>
      { open && <PaymentModal order={order} discount={discount} total={calcTotal()} paySuccess={cancelOrder} handleOpen={(val) => setOpen(val)} setOrderId={setOrderId}/> }
      { orderId && <PrintableReceipt order={order} orderId={orderId}/> }
      { !!order.length && discountOpen && <DiscountModal discountProp={discount} handleOpen={val => setDiscountOpen(val)} handleConfirm={(discount) => {handleAddDiscount(discount)}} /> }
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

const EmptyCart = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(['empty-cart', className])}>
      <img
        src={require('../../../../static/supermarket.svg')}
        alt={ t('sale.cartEmpty') }
      />
      <Typography variant="body1">
        { t('sale.cartEmpty') }
      </Typography>
    </div>
  );
}

export default Receipt;