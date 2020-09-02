import React, {
  useContext
} from 'react';
import {
  IconButton,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import {
  Add,
  Remove,
  Delete
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Typography from '../Typography';
import { Context } from '../../../../context/storeContext';
import { formatAsCurrency } from '../../../../utils';

const Receipt = ({ order, setOrder }) => {
  const { state, createOrder } = useContext(Context);
  const { t } = useTranslation();

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

  return (
    <Paper
      elevation={3}
    >
      <Table className="receipt table">
        <TableHead className="header">
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">
                { t('sale.quantity') }
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">
                { t('sale.product') }
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">
                { t('sale.price') }
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">
                { t('sale.amount') }
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">
                { t('sale.del') }
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <React.Fragment>
            { order.map(prod => <ReceiptItem product={prod} addRemoveProduct={addRemoveProduct} deleteProduct={deleteProduct} key={prod._id} />) }
          </React.Fragment>
          <React.Fragment>
            {
              order.length ? 
              <React.Fragment>
                {
                  state.store.tax.enable ?
                  <React.Fragment>
                    <TableRow>
                      <TableCell rowSpan={2} className="span-2"/>
                      <TableCell rowSpan={2} className="span-2"/>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle2">
                          { t('sale.subtotal') }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          { calcSubtotal() }
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle2">
                          <span style={{'paddingRight': '0.2rem'}}>
                            { t('sale.tax') }
                          </span> 
                          { state.store.tax.rate * 100 }%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          { calcTax() }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                  :
                  null
                }
                <React.Fragment>
                  <TableRow>
                    <TableCell rowSpan={1}/>
                    <TableCell rowSpan={1}/>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle2">
                        { t('sale.total') }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        { formatAsCurrency(calcTotal()) }
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell/>
                    <TableCell>
                      <Button
                        onClick={cancelOrder}
                      >
                        { t('common.cancel') }
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={placeOrder}
                      >
                        { t('common.save') }
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        // onClick={placeOrder}
                      >
                        Card
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        // onClick={placeOrder}
                      >
                        Cash
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              </React.Fragment>
              :
              <div className="no-product">
                <Typography variant="subtitle1">
                  { t('common.sysReady') }
                </Typography>
              </div>
            }
          </React.Fragment>
        </TableBody>
      </Table>
    </Paper>
  );
}

const ReceiptItem = ({ product, addRemoveProduct, deleteProduct }) => {
  return (
    <TableRow>
      <TableCell>
        <div className="receipt-count">
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
      </TableCell>
      <TableCell>
        <Typography variant="body1">
          { product.name }
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">
          { product.price.toFixed(2) }
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">
          { (product.count * product.price).toFixed(2) }
        </Typography>
      </TableCell>
      <TableCell>
        <IconButton
          color="primary"
          size="small"
          aria-label="delete"
          onClick={() => deleteProduct(product) }
        >
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>

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