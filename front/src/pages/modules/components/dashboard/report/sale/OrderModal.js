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
import { fmtStaffNo, computePriceSummary } from '../../../../../../utils';

const OrderModal = ({ order, closeModal }) => {
  const { t } = useTranslation();

  const { subtotal, discount, tax, total } = computePriceSummary(order);

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
                  { `Cashier` }
                </Typography>
              </div>
              <div className="value">{ fmtStaffNo(order.processedBy) }</div>
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
              order.taxRate !== 0 &&
              <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      { t('sale.subtotal') }
                    </Typography>
                  </div>
                  <div className="value">{ formatAsCurrency(subtotal) }</div>
                </div>
            }
            {
              order.discount &&
              <div className="row">
                <div className="label">
                  <Typography variant="subtitle2">
                    Discount { order.discount.method === 'Percent' ? `${order.discount.value * 100}%` : '' }
                  </Typography>
                </div>
                <div className="value">{ formatAsCurrency(discount) }</div>
              </div>
            }
            {
              order.taxRate !== 0 &&
              <div className="row">
                <div className="label">
                  <Typography variant="subtitle2">
                    { t('tax.heading') }
                  </Typography>
                </div>
                <div className="value">{ formatAsCurrency(tax) }</div>
              </div>
            }
            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  { t('order.total') }
                </Typography>
              </div>
              <div className="value">{ formatAsCurrency(total) }</div>
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
          <div className="items">
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
  const { storeState } = useContext(Context);
  const product = storeState.products.find(prod => prod._id === order.product);

  return (
    <div className="odr-row">
      <div className="title">
        <div className="left">
          <Typography variant="body2">
            { product.name }
          </Typography>
        </div>
        <div className="right">
          <div className="amt">
            <Typography variant="body2">
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
