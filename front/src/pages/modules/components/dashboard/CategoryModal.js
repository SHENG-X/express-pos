import React, {
  useState,
  useContext,
} from 'react';
import {
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
        updateCategory(
          category,
          () => {
            handleCancel();
          },
          () => {
            // TODO: handle update failed
          }
        );
      }
    } else {
      addCategory(
        category,
        () => { handleCancel(); },
        () => {
          // TODO: handle failed to create a category
        }
      );
    }
  }

  return (
    <ModalBase
      title={ initCategory ? t('category.update') : t('category.title') }
      className="category-modal"
      content={
        <div>
          {/* <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                { t('common.thumbnail') }
              </Typography>
            </div>
            <div className="input">

            </div>
          </div> */}

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                { t('common.name') }
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                value={category.name}
                onChange={e => setCategory({...category, name: e.target.value})}
                placeholder={ t('category.categoryName') }
              />
            </div>
          </div>
        </div>
      }
      actions={
        <React.Fragment>
          <Button
            variant="contained"
            onClick={handleCancel}
          >
            { t('common.cancel') }
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleConfirm}
          >
            { t('common.confirm') }
          </Button>
        </React.Fragment>
      }
    />
  );
}

export default CategoryModal;
