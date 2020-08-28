import React, {
  useState
} from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton
} from '@material-ui/core';
import {
  Add,
  Remove
} from '@material-ui/icons';

import ModalBase from '../ModalBase';

const ProductModal = ({ selectedProduct, handleOpen, handleConfirm }) => {
  const prices = selectedProduct.prices.map(p => p.value);
  const [product, setProduct] = useState({...selectedProduct, count: 1, price: Math.max(...prices)});
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
    <ModalBase
      title="Add a product"
      className="product-modal"
      content={
        <React.Fragment>
          <div className="count row">
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
          <div className="price row">
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
                    product.prices.map(p => (<MenuItem value={p.value} key={p.value}>{`${p.name} - ${p.value}`}</MenuItem>))
                  }
                </Select>
              </FormControl>
            </div>
          </div>
        </React.Fragment>
      }
      actions={
        <React.Fragment>
          <Button 
            onClick={() => handleOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirm(product)}
          >
            Confirm
          </Button>
        </React.Fragment>
      }
    />
  );
}

export default ProductModal;
