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

const CategoryModal = ({handleOpen, handleConfirm}) => {
  return (
    <ModalBase
      title="Add a category"
      className="category-modal"
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

export default CategoryModal;
