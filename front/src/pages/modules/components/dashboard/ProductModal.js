import React from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';

import ModalBase from '../ModalBase';

const ProductModal = ({ handleOpen }) => {
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
                // value={category}
                // onChange={e => setCategory(e.target.value)}
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
            <div className="input">
              <TextField
                required
                type="number"
                placeholder="Product price"
              />
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
                placeholder="Product cost"
              />
            </div>
          </div>
        </div>
      }
      actions={
        <div>
          <Button 
            onClick={() => handleOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleOpen(false)}
          >
            Confirm
          </Button>
        </div>
      }
    />
  );
}

export default ProductModal;
