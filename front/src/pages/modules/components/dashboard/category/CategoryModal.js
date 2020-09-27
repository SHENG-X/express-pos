import React, {
  useState,
  useContext,
} from 'react';
import {
  Typography,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import { Formik, Form, Field } from 'formik';
import {
  TextField,
} from 'formik-material-ui';
import PropTypes from 'prop-types';

import ModalBaseV2 from '../../ModalBaseV2';
import { Context } from '../../../../../context/storeContext';
import ImageUpload from '../../upload/ImageUpload';
import { CategorySchema } from '../../../formik/validationSchema';

const CategoryModal = ({ handleOpen, initCategory }) => {
  let defaultCategory = {
    thumbnail: '',
    name: '',
  };

  if (initCategory) {
    defaultCategory = initCategory;
  }

  const [category, setCategory] = useState({ ...defaultCategory });
  const { storeState, createCategory, updateCategory } = useContext(Context);
  const { t } = useTranslation();
  const { addToast } = useToasts();

  const handleCancel = () => {
    setCategory({ ...defaultCategory });
    handleOpen(false);
  };

  const handleConfirm = (values, completeSubmit) => {
    const categorySubmit = { ...category, name: values.name };
    if (initCategory) {
      const categoryOriginal = storeState.categories.find((ctgry) => (
        ctgry._id === categorySubmit._id
      ));
      if (JSON.stringify(categoryOriginal) === JSON.stringify(categorySubmit)) {
        completeSubmit();
        handleCancel();
      } else {
        updateCategory(
          categorySubmit,
          () => {
            completeSubmit();
            handleCancel();
            addToast('Update the category success', { appearance: 'success' });
          },
          () => {
            completeSubmit();
            addToast('Unable to update the category, please try again later', { appearance: 'error' });
          },
        );
      }
    } else {
      createCategory(
        categorySubmit,
        () => {
          completeSubmit();
          handleCancel();
          addToast('Add a category success', { appearance: 'success' });
        },
        () => {
          completeSubmit();
          addToast('Unable to create a category, please try again later', { appearance: 'error' });
        },
      );
    }
  };

  const handleImageUpload = (image) => {
    setCategory({ ...category, thumbnail: image });
  };

  return (
    <ModalBaseV2
      title={initCategory ? t('category.update') : t('category.title')}
      className="category-modal"
    >
      <Formik
        initialValues={category}
        validationSchema={CategorySchema}
        onSubmit={(values, { setSubmitting }) => {
          handleConfirm(values, () => setSubmitting(false));
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <div className="content">
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
                  <Field
                    component={TextField}
                    name="name"
                    placeholder={t('category.categoryName')}
                  />
                </div>
              </div>
            </div>
            {
              isSubmitting && (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              )
            }
            <div className="actions">
              <Button
                variant="contained"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                { t('common.cancel') }
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={submitForm}
                disabled={isSubmitting}
              >
                { t('common.confirm') }
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalBaseV2>
  );
};

CategoryModal.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  initCategory: PropTypes.instanceOf(PropTypes.object).isRequired,
};

export default CategoryModal;
