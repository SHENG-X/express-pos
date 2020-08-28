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
  Delete
} from '@material-ui/icons';

import ModalBase from '../ModalBase';

const ProductModal = ({ handleOpen }) => {
  const defaultProduct = {
    thumbnail: '',
    name: '',
    count: undefined,
    category: '',
    prices: [
      { name:'', value: undefined }
    ],
    cost: undefined
  };

  const [product, setProduct] = useState(JSON.parse(JSON.stringify(defaultProduct)));

  const setProductPrices = (idx, fieldName, val) => {
    const newPrices = [...product.prices];
    newPrices[idx][fieldName] = val;
    setProduct({...product, prices: newPrices});
  }

  const addNewPrice = () => {
    setProduct({...product, prices: [...product.prices, { name: '', value: undefined }]});
  }
  const deletePrice = (idx) => {
    const newPrices = [...product.prices];
    newPrices.splice(idx, 1);
    setProduct({...product, prices: newPrices});
  }

  const handleCancel = () => {
    // reset default product state
    setProduct(JSON.parse(JSON.stringify(defaultProduct)));
    // close modal window
    handleOpen(false);
  }

  const handleConfirm = () => {
    console.log(product);
    handleCancel();
  }

  return (
    <ModalBase
      title="Add a product"
      className="product-modal"
      content={
        <div>
          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Thumbnail
              </Typography>
            </div>
            <div className="input">

            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Name
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                value={product.name}
                onChange={e => setProduct({...product, name: e.target.value})}
                placeholder="Product name"
              />
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Count
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                value={product.count}
                onChange={e => setProduct({...product, count: e.target.value})}
                type="number"
                placeholder="Product count"
              />
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Category
              </Typography>
            </div>
            <div className="input">
            <FormControl variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={product.category}
                onChange={e => setProduct({...product, category: e.target.value})}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>C1</MenuItem>
                <MenuItem value={20}>C2</MenuItem>
                <MenuItem value={30}>C3</MenuItem>
              </Select>
            </FormControl>
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Prices
              </Typography>
            </div>
            <div className="input price">
              <div class="price-row">
               {
                 product.prices.map((price, idx) => (
                  <div>
                    <TextField
                      required
                      value={price.name}
                      onChange={e => setProductPrices(idx, 'name', e.target.value)}
                      placeholder="Price name"
                    />
                    <TextField
                      required
                      type="number"
                      value={price.value}
                      onChange={e => setProductPrices(idx, 'value', e.target.value)}
                      placeholder="Price value"
                    /> 
                    {
                      idx !== 0 ?
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => deletePrice(idx)}
                      >
                        <Delete />
                      </IconButton>
                      :
                      null
                    }
                  </div>
                 ))
               }
              </div>
              <div className="add">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={addNewPrice}
                >
                  <Add />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Cost
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                type="number"
                value={product.cost}
                onChange={e => setProduct({...product, cost: e.target.value})}
                placeholder="Product cost"
              />
            </div>
          </div>
        </div>
      }
      actions={
        <div>
          <Button 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      }
    />
  );
}

export default ProductModal;
