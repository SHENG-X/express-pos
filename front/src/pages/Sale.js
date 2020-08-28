import React, {
  useState,
} from 'react';
import {
  Grid,
  Button
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import withRoot from './modules/withRoot';
import AppAppBar from './modules/views/AppAppBar';
import Receipt from './modules/components/sale/Receipt';
import Products from './modules/components/sale/Products';
import ProductModal from './modules/components/sale/ProductModal';

const Sale = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [order, setOrder] = useState([]);
  const history = useHistory();
  
  const handleOpen = (product) => {
    setSelectedProduct({...product, price: Math.max(...product.prices)});
    setOpen(true);
  }

  const handleConfirm = (product) => {
    const productAdded = order.find(prod => prod._id === product._id && prod.price === product.price);
    let newOrder = [];
    if (productAdded) {
      newOrder = order.map(prod => {
        if (prod._id === product._id && prod.price === product.price) {
          return {...prod, count: prod.count + product.count};
        }
        return prod;
      })
    } else {
      newOrder = [...order, product];
    }
    setOrder(newOrder);
    setSelectedProduct({});
    setOpen(false);
  }

  return (
    <div className="sale" >
      <React.Fragment>
        <AppAppBar />
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Receipt order={order} setOrder={setOrder} />
          </Grid>
          <Grid item xs={8}>
            <Products handleOpen={handleOpen} />
          </Grid>
        </Grid>
        {
          open ? 
          <ProductModal
            selectedProduct={selectedProduct}
            handleOpen={val => setOpen(val)}
            handleConfirm={handleConfirm}
          />
          : null
        }
      </React.Fragment>
    </div>
  );
}

export default withRoot(Sale);
