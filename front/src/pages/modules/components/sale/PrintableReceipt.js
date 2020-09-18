import React, {
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Context as OrderContext} from '../../../../context/orderContext';
import { Context as StoreContext} from '../../../../context/storeContext';
import { fmtStaffNo, computePriceSummary } from '../../../../utils';

const PrintableReceipt = ({ orderId }) => {
  const { t } = useTranslation();
  const { orderState } = useContext(OrderContext);
  const { storeState } = useContext(StoreContext);
  const order = orderState.find(ord => ord._id === orderId);

  const { subtotal, discount, tax, total } = computePriceSummary(order);

  return (
    <div className="print">
      <div className="receipt-copy">
        <div className="header">
          <div className="name">
            { storeState.name }
          </div>
          <div className="type">
            <span>{ t('sale.type') }:</span>
            <span>
              { order.paymentType }
            </span>
          </div>
          <div className="type">
            <span>{ `Cashier No.` }:</span>
            <span>
              { fmtStaffNo(order.processedBy) }
            </span>
          </div>
          <div>
            { new Date(order.createdAt).toLocaleString() }
          </div>
        </div>
        <div className="main">
          {
            order.products.map(prod => <PrintableReceiptItem prod={prod} key={prod.product}/>)
          }
          <div className="summary">
            {
              tax !== 0 && 
              <div className="subtotal row">
                <div>{ t('sale.subtotal') }</div>
                <div>
                  { subtotal }
                </div>
              </div>
            }
            {
              order.discount &&
              <div className="discount row">
                <div>Discount</div>
                <div>
                  { discount }
                </div>
              </div>
            }
            {
              tax !== 0 && 
              <div className="tax row">
                <div>
                  { t('tax.heading') } { order.taxRate * 100 }%
                </div>
                <div>
                  { tax }
                </div>
              </div>
            }
            <div className="total row">
              <div>{ t('sale.total') }</div>
              <div>{ total }</div>
            </div>
          </div>
        </div>
        <div className="footer">
          {/* { t('common.thankYou') } */}
        </div>
      </div>
    </div>
  );
}

const PrintableReceiptItem = ({ prod }) => {
  const { storeState } = useContext(StoreContext);
  const productName = storeState.products.find(product => product._id === prod.product).name;

  return (
    <div className="item">
      <div className="title">
        <div>{ productName }</div>
        <div>{ (prod.count * prod.price).toFixed(2) }</div>
      </div>
      <div className="subtitle">
        { prod.count } x { prod.price}
      </div>
    </div>
  );
}

export default PrintableReceipt;