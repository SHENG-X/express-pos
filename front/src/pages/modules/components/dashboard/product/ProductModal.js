import React, {
  useState,
  useContext,
} from 'react';
import {
  Typography,
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@material-ui/core';
import {
  Add,
  Delete,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import {
  Formik,
  Form,
  Field,
  FieldArray,
} from 'formik';
import {
  TextField,
} from 'formik-material-ui';
import PropTypes from 'prop-types';

import ModalBaseV2 from '../../ModalBaseV2';
import { Context } from '../../../../../context/storeContext';
import ImageUpload from '../../upload/ImageUpload';
import PriceTextField from '../../../formik/PriceTextField';
import IntegerTextField from '../../../formik/IntegerTextField';
import { ProductSchema } from '../../../formik/validationSchema';

const ProductModal = ({ handleOpen, initProduct }) => {
  let defaultProduct = {
    thumbnail: '',
    enable: true,
    name: '',
    count: '',
    category: null,
    prices: [
      { name: '', value: '' },
    ],
    cost: '',
  };

  if (initProduct) {
    defaultProduct = initProduct;
  }

  const { storeState, createProduct, updateProduct } = useContext(Context);

  const [product, setProduct] = useState(JSON.parse(JSON.stringify(defaultProduct)));

  const { t } = useTranslation();

  const { addToast } = useToasts();

  const handleCancel = () => {
    // reset default product state
    setProduct(JSON.parse(JSON.stringify(defaultProduct)));
    // close modal window
    handleOpen(false);
  };

  const handleConfirm = (productSubmit, completeSubmit) => {
    if (initProduct) {
      const productOriginal = storeState.products.find((prod) => prod._id === productSubmit._id);
      if (JSON.stringify(productOriginal) === JSON.stringify(productSubmit)) {
        completeSubmit();
        handleCancel();
      } else {
        updateProduct(
          productSubmit,
          () => {
            completeSubmit();
            handleCancel();
            addToast('Update success', { appearance: 'success' });
          },
          () => {
            completeSubmit();
            addToast('Unable to update the product, please try again later', { appearance: 'error' });
          },
        );
      }
    } else {
      createProduct(
        productSubmit,
        () => {
          completeSubmit();
          handleCancel();
          addToast('Create product success', { appearance: 'success' });
        },
        () => {
          completeSubmit();
          addToast('Unable to create the product, please try again later', { appearance: 'error' });
        },
      );
    }
  };

  const handleImageUpload = (image) => {
    setProduct({ ...product, thumbnail: image });
  };

  return (
    <ModalBaseV2
      title={initProduct ? t('product.update') : t('product.title')}
      className="product-modal"
    >
      <Formik
        initialValues={product}
        validationSchema={ProductSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleConfirm(values, () => setSubmitting(false));
        }}
        enableReinitialize
      >
        {({ submitForm, isSubmitting, values }) => (
          <Form autoComplete="off">
            <div className="content">
              <div className="row">
                <div className="label">
                  <Typography variant="subtitle2">
                    { t('common.thumbnail') }
                  </Typography>
                </div>
                <div className="input">
                  <ImageUpload handleImageUpload={handleImageUpload} obj={product} />
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
                    placeholder={t('product.productName')}
                    InputProps={{
                      inputProps: {
                        autocomplete: "new-product-name"
                      },
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="label">
                  <Typography variant="subtitle2">
                    { t('common.count') }
                  </Typography>
                </div>
                <div className="input">
                  <Field
                    component={IntegerTextField}
                    name="count"
                    placeholder={t('product.productCount')}
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="label">
                  <Typography variant="subtitle2">
                    { t('category.heading') }
                  </Typography>
                </div>
                <div className="input">
                  <Field
                    component={TextField}
                    type="text"
                    name="category"
                    select
                    variant="outlined"
                  >
                    <MenuItem value={null}>
                      <em>{ t('common.none') }</em>
                    </MenuItem>
                    {
                      storeState.categories.map((category) => (
                        <MenuItem
                          value={category._id}
                          key={category._id}
                        >
                          { category.name }
                        </MenuItem>
                      ))
                    }
                  </Field>
                </div>
              </div>

              <div className="row">
                <div className="label">
                  <Typography variant="subtitle2">
                    { t('sale.prices') }
                  </Typography>
                </div>
                <FieldArray name="prices">
                  {({ remove, push }) => (
                    <div className="input price">
                      <div className="price-row">
                        <>
                          {
                            values.prices.map((price, idx) => (
                              <div
                                className="flex"
                                style={{ paddingRight: `${idx === 0 ? '2rem' : ''}` }}
                                key={`${price.name}-${price.value}`}
                              >
                                <Field
                                  component={TextField}
                                  name={`prices.${idx}.name`}
                                  placeholder={t('product.priceName')}
                                />
                                <Field
                                  component={PriceTextField}
                                  name={`prices.${idx}.value`}
                                  placeholder={t('product.priceValue')}
                                  InputProps={{
                                    inputProps: {
                                      min: 0,
                                    },
                                  }}
                                />
                                {
                                  idx !== 0 && (
                                    <Tooltip
                                      title="Delete"
                                      arrow
                                    >
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => remove(idx)}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Tooltip>
                                  )
                                }
                              </div>
                            ))
                          }
                        </>
                      </div>
                      <div className="add">
                        <Tooltip
                          title="Add"
                          arrow
                        >
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => push({ name: '', value: '' })}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="row">
                <div className="label">
                  <Typography variant="subtitle2">
                    { t('product.cost') }
                  </Typography>
                </div>
                <div className="input">
                  <Field
                    component={PriceTextField}
                    name="cost"
                    placeholder={t('product.productCost')}
                    InputProps={{
                      inputProps: {
                        min: 0,
                        autocomplete: "off",
                      },
                    }}
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

ProductModal.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  initProduct: PropTypes.instanceOf(PropTypes.object).isRequired,
};

export default ProductModal;
