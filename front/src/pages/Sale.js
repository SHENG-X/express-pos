import React, {
  useState,
} from 'react';
import {
  Grid,
  Typography,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import {
  Add,
  Remove,
  Delete
} from '@material-ui/icons';

import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import Receipt from './modules/components/Receipt';
import Products from './modules/components/Products';
import Paper from './modules/components/Paper';

const Sale = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [order, setOrder] = useState([]);
  const handleClose = () => {
    setOpen(false);
  }

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
          return {...prod, count: prod.count + 1};
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
          <ProductModal selectedProduct={selectedProduct} handleClose={handleClose} handleConfirm={handleConfirm}/>
          : null
        }
      </React.Fragment>
    </div>
  );
}

const ProductModal = ({ selectedProduct, handleClose, handleConfirm }) => {

  const [product, setProduct] = useState(selectedProduct);
  const addRemoveProduct = (action) => {
    let base = 1;
    if (action === 'remove') {
      base = -1;
    }
    if (product.count + base < 1) {
      return;
    }
    setProduct({...product, count: product.count + base})
  }

  return (
    <div className="product-model carpet">
      <Paper elevation={3} className="content">
        <div className="heading">
          <Typography variant="h5">
            { product.name }
          </Typography>
        </div>
        <div className="content">
          <div className="count">
            <div className="label">
            <Typography variant="subtitle1">
              Quantity
            </Typography>
            </div>
            <div className="action">
              <IconButton
                color="primary"
                size="small"
                aria-label="add one"
                onClick={() => addRemoveProduct('add')}
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
                onClick={() => addRemoveProduct('remove')}
              >
                <Remove />
              </IconButton>
            </div>
          </div>
          <div className="price">
            <div className="label">
              <Typography variant="subtitle1">
                Price
              </Typography>
            </div>
            <div className="action">
              <FormControl variant="outlined" >
                <InputLabel id="demo-simple-select-outlined-label">Price</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={product.price}
                  onChange={(e) => setProduct({...product, price: e.target.value})}
                  label="Price"
                >
                  {
                    product.prices.map(p => (<MenuItem value={p} key={p}>{p}</MenuItem>))
                  }
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="actions">
          <Button 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirm(product)}
          >
            Confirm
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default withRoot(Sale);
