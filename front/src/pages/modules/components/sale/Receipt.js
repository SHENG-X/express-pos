import React, {
  useState,
  useContext
} from 'react';
import {
  IconButton,
  Button,
} from '@material-ui/core';
import {
  Add,
  Remove,
  Delete
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Paper from '../Paper';
import Typography from '../Typography';
import { Context } from '../../../../context/storeContext';

const Receipt = ({ order, setOrder }) => {
  const { state } = useContext(Context);
  const { t } = useTranslation();

  const deleteProduct = (product) => {
    const newProducts = order.filter(prod => {
      if (prod._id === product._id && prod.price === product.price) {
      } else {
        return prod;
      }
    });
    setOrder(newProducts);
  }

  const addRemoveProduct = (action, product) => {
    let base = 1;
    if (action === 'remove') {
      base = -1;
    }
    const newProducts = order.map(prod => {
      if (prod._id === product._id && prod.price === product.price ) {
        if (prod.count + base < 1) {
          return prod;
        }
        prod.count += base;
        return prod;
      }
      return prod;
    });
    setOrder(newProducts);
  }

  const calcSubtotal = () => {
    return order.reduce((res, prod) => res += prod.count * prod.price, 0).toFixed(2);
  }

  const calcTax = () => {
    return (state.store.tax.rate * Number(calcSubtotal())).toFixed(2);
  }

  const calcTotal = () => {
    return (Number(calcSubtotal()) + Number(calcTax())).toFixed(2);
  }

  return (
    <Paper
      elevation={3}
    >
      <div className="receipt">
        <div className="heading row">
          <div className="col-qty">
            <Typography variant="subtitle1">
              { t('sale.quantity') }
            </Typography>
          </div>
          <div className="col-product">
            <Typography variant="subtitle1">
              { t('sale.product') }
            </Typography>
          </div>
          <div className="col-price">
            <Typography variant="subtitle1">
              { t('sale.price') }
            </Typography>
          </div>
          <div className="col-total">
            <Typography variant="subtitle1">
              { t('sale.amount') }
            </Typography>
          </div>
          <div className="col-del">
            <Typography variant="subtitle1">
              { t('sale.del') }
            </Typography>
          </div>
        </div>
        {
          order.length ? 
          <React.Fragment>
            <div className="content">
            {
              order.map(prod => <ReceiptItem product={prod} addRemoveProduct={addRemoveProduct} deleteProduct={deleteProduct} key={prod._id} />)
            }
            </div>
            <div className="footer">
              {
                state.store.tax.enable ? 
                <React.Fragment>
                  <div className="row">
                    <div className="col-label">
                      <Typography variant="subtitle2">
                        { t('sale.subtotal') }
                      </Typography>
                    </div>
                    <div className="col-amount">
                      <Typography variant="body2">
                        { calcSubtotal() }
                      </Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-label">
                      <Typography variant="subtitle2">
                        <span style={{'padding-right': '0.2rem'}}>
                          { t('sale.tax') }
                        </span> 
                        { state.store.tax.rate * 100 }%
                      </Typography>
                    </div>
                    <div className="col-amount">
                      <Typography variant="body2">
                        { calcTax() }
                      </Typography>
                    </div>
                  </div>
                </React.Fragment>
                :
                null
              }
              <div className="row">
                <div className="col-label">
                  <Typography variant="subtitle2">
                    { t('sale.total') }
                  </Typography>
                </div>
                <div className="col-amount">
                  <Typography variant="body1">
                    { calcTotal() }
                  </Typography>
                </div>
              </div>
              <div className="row">
                <Button>
                  { t('common.cancel') }
                </Button>
                <Button>
                  { t('common.save') }
                </Button>
              </div>
            </div>
          </React.Fragment>
          :
          <div className="no-product">
            <Typography variant="subtitle1">
              Waiting for entries.
            </Typography>
          </div>
        }
      </div>
    </Paper>
  );
}

const ReceiptItem = ({ product, addRemoveProduct, deleteProduct }) => {
  return (
    <div class="row">
      <div className="col-qty">
        <IconButton
          color="primary"
          size="small"
          aria-label="add one"
          onClick={() => addRemoveProduct('add', product)}
        >
          <Add />
        </IconButton>
        <Typography variant="subtitle2" align="center" className="count">
          { product.count }
        </Typography>
        <IconButton
          color="primary"
          size="small"
          aria-label="remove one"
          onClick={() => addRemoveProduct('remove', product)}
        >
          <Remove />
        </IconButton>
      </div>
      <div className="col-product">
        <Typography variant="body1">
          { product.name }
        </Typography>
      </div>
      <div className="col-price">
        <Typography variant="body1">
          { product.price.toFixed(2) }
        </Typography>
      </div>
      <div className="col-total">
        <Typography variant="body1">
          { (product.count * product.price).toFixed(2) }
        </Typography>
      </div>
      <div className="col-del">
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
  );
}

export default Receipt;