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

const CategoryModal = ({ handleOpen, initCategory }) => {
  let defaultCategory = {
    thumbnail: '',
    name: '',
  };

  if (initCategory) {
    defaultCategory = initCategory;
  }

  const [category, setCategory] = useState({...defaultCategory});
  const { state, addCategory, updateCategory } = useContext(Context);

  const handleCancel = () => {
    setCategory({...defaultCategory});
    handleOpen(false);
  }

  const handleConfirm = () => {
    if (initCategory) {
      const categoryOriginal = state.store.categories.find(ctgry => ctgry._id === category._id);
      if (JSON.stringify(categoryOriginal) === JSON.stringify(category)) {
        handleCancel();
      } else {
        updateCategory(category, () => {
          handleCancel();
        });
      }
    } else {
      addCategory({...category, store: state.store._id}, (response) => {
        if (response.status === 201) {
          handleCancel();
        } else {
          console.log(response);
        }
      });
    }
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
