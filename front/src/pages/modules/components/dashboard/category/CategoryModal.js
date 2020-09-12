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
import { useToasts } from 'react-toast-notifications';

import ModalBase from '../../ModalBase';
import { Context } from '../../../../../context/storeContext';
import ImageUpload from '../../upload/ImageUpload';

const CategoryModal = ({ handleOpen, initCategory }) => {
  let defaultCategory = {
    thumbnail: '',
    name: '',
  };

  if (initCategory) {
    defaultCategory = initCategory;
  }

  const [category, setCategory] = useState({...defaultCategory});
  const { storeState, createCategory, updateCategory } = useContext(Context);
  const { t } = useTranslation();
  const { addToast } = useToasts();

  const handleCancel = () => {
    setCategory({...defaultCategory});
    handleOpen(false);
  }

  const handleConfirm = () => {
    if (initCategory) {
      const categoryOriginal = storeState.categories.find(ctgry => ctgry._id === category._id);
      if (JSON.stringify(categoryOriginal) === JSON.stringify(category)) {
        handleCancel();
      } else {
        updateCategory(
          category,
          () => {
            handleCancel();
            addToast('Update the category success', { appearance: 'success' });
          },
          () => {
            addToast('Unable to update the category, please try again later', { appearance: 'error' });
          }
        );
      }
    } else {
      createCategory(
        category,
        () => { 
          handleCancel();
          addToast('Add a category success', { appearance: 'success' });
        },
        () => {
          addToast('Unable to create a category, please try again later', { appearance: 'error' });
        }
      );
    }
  }
  const handleImageUpload = (image) => {
    setCategory({ ...category, thumbnail: image });
  }

  return (
    <ModalBase
      title={ initCategory ? t('category.update') : t('category.title') }
      className="category-modal"
      content={
        <div>
          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                { t('common.thumbnail') }
              </Typography>
            </div>
            <div className="input">
              <ImageUpload handleImageUpload={handleImageUpload} obj={category} />
            </div>
          </div>

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
