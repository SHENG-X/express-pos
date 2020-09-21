import React, {
  useState
} from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  TextField,
} from '@material-ui/core';
import {
  Add,
  Remove
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import ModalBase from '../ModalBase';

const ProductModal = ({ selectedProduct, handleOpen, handleConfirm }) => {
  const prices = selectedProduct.prices.map(p => p.value);
  const [product, setProduct] = useState({...selectedProduct, count: 1, price: Math.max(...prices)});
  const { t } = useTranslation();

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
      title={ t('product.title') }
      className="product-modal"
      content={
        <React.Fragment>
          <div className="count row">
            <div className="label">
            <Typography variant="subtitle1">
              { t('sale.quantity') }
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
              <TextField
                type="number"
                value={Number(product.count)}
                onChange={e => setProduct({...product, count: Number(e.target.value)})}
              />
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
                { t('sale.price') }
              </Typography>
            </div>
            <div className="action flex items-center">
              {
                product.prices.length === 1 ?
                <Typography variant="body1">
                  { product.prices[0].value }
                </Typography>
                :
                <FormControl variant="outlined" >
                  <Select
                    value={product.price}
                    onChange={(e) => setProduct({...product, price: e.target.value})}
                    disabled={product.prices.length === 1}
                  >
                    {
                      product.prices.map(p => (<MenuItem value={p.value} key={p.value}>{
                          p.name ? 
                          `${p.name} - ${p.value}`
                          :
                          p.value
                      }</MenuItem>))
                    }
                  </Select>
                </FormControl>
              }
            </div>
          </div>
        </React.Fragment>
      }
      actions={
        <React.Fragment>
          <Button
            variant="contained"
            onClick={() => handleOpen(false)}
          >
            { t('common.cancel') }
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleConfirm(product)}
          >
            { t('common.confirm') }
          </Button>
        </React.Fragment>
      }
    />
  );
}

export default ProductModal;
