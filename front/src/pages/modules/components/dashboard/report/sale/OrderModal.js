import React, {
  useContext,
} from 'react';
import {
  Button,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import ModalBase from '../../../ModalBase';
import { formatAsCurrency } from '../../../../../../utils';
import { Context } from '../../../../../../context/storeContext';

const OrderModal = ({ order, closeModal }) => {
  const { t } = useTranslation();

  const computeSubtotal = () => {
    return order.products.reduce((acc, prod) => acc + prod.count * prod.price, 0);
  }
  const computeTax = () => {
    return computeSubtotal() * order.taxRate;
  }
  const computeOrderTotal = () => {
    return computeSubtotal() + computeTax();
  }

  return (
    <ModalBase
      className="order-view-modal"
      title={'Order Snapshot'}
      content={
        <React.Fragment>
          <div className="summary">
            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  { t('order.date') }
                </Typography>
              </div>
              <div className="value">{ new Date(order.createdAt).toLocaleString() }</div>
            </div>
            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  { t('order.method') }
                </Typography>
              </div>
              <div className="value">{ order.paymentType }</div>
            </div>
            {
              order.taxRate === 0 ?
              null
              :
              <React.Fragment>
                <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      { t('sale.subtotal') }
                    </Typography>
                  </div>
                  <div className="value">{ formatAsCurrency(computeSubtotal()) }</div>
                </div>
                <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      { t('tax.heading') }
                    </Typography>
                  </div>
                  <div className="value">{ formatAsCurrency(computeTax()) }</div>
                </div>
              </React.Fragment>
            }
            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  { t('order.total') }
                </Typography>
              </div>
              <div className="value">{ formatAsCurrency(computeOrderTotal()) }</div>
            </div>
            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  { t('order.amount') }
                </Typography>
              </div>
              <div className="value">{ formatAsCurrency(order.amountPaid) }</div>
            </div>
          </div>
          <div className="items" style={{paddingTop: `${order.taxRate === 0 ? '130px': '170px'}`}}>
            {
              order.products.map(odr => <ProductItem order={odr} key={odr._id}/>)
            }
          </div>
        </React.Fragment>
      }
      actions={
        <Button
          color="primary"
          variant="contained"
          onClick={closeModal}
        >
          { t('common.close') }
        </Button>
      }
    />
  );
}

const ProductItem = ({ order }) => {
  const { state } = useContext(Context);
  const product = state.store.products.find(prod => prod._id === order.product);

  return (
    <div className="odr-row">
      <div className="title">
        <div className="left">
          <Typography variant="subtitle2">
            { product.name }
          </Typography>
        </div>
        <div className="right">
          <div className="amt">
            <Typography variant="subtitle2">
              { formatAsCurrency(order.count * order.price) }
            </Typography>
          </div>
        </div>
      </div>
      <div className="subtitle">
        <Typography variant="caption">
          { order.count } x { formatAsCurrency(order.price) }
        </Typography>
      </div>
    </div>
  );
}

export default OrderModal;
