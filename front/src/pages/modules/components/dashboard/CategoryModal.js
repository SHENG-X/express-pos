import React, {
  useState,
  useContext,
} from 'react';
import {
  Typography,
  TextField,
  Button,
} from '@material-ui/core';

import ModalBase from '../ModalBase';
import { Context } from '../../../../context/storeContext';

const CategoryModal = ({ handleOpen }) => {
  const defaultCategory = {
    thumbnail: '',
    name: '',
    prodCount: 0,
  };

  const [category, setCategory] = useState({...defaultCategory});
  const { addCategory } = useContext(Context);

  const handleCancel = () => {
    setCategory({...defaultCategory});
    handleOpen(false);
  }

  const handleConfirm = () => {
    addCategory(category);
    handleCancel();
  }

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
                value={category.name}
                onChange={e => setCategory({...category, name: e.target.value})}
                placeholder="Product name"
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

export default CategoryModal;
