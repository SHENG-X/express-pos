import React, {
  useState,
  useContext
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
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';

import ModalBase from '../../ModalBase';
import { Context } from '../../../../../context/storeContext';
import ImageUpload from '../../upload/ImageUpload';

const ProductModal = ({ handleOpen, initProduct }) => {
  let defaultProduct = {
    thumbnail: '',
    enable: true,
    name: '',
    count: '',
    category: null,
    prices: [
      { name:'', value: '' }
    ],
    cost: ''
  };

  if (initProduct) {
    defaultProduct = initProduct;
  }

  const { storeState, createProduct, updateProduct } = useContext(Context);

  const [product, setProduct] = useState(JSON.parse(JSON.stringify(defaultProduct)));

  const { t } = useTranslation();

  const { addToast } = useToasts();

  const setProductPrices = (idx, fieldName, val) => {
    const newPrices = [...product.prices];
    newPrices[idx][fieldName] = val;
    setProduct({...product, prices: newPrices});
  }

  const addNewPrice = () => {
    setProduct({...product, prices: [...product.prices, { name: '', value: '' }]});
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
    if (initProduct) {
      const productOriginal = storeState.products.find(prod => prod._id === product._id);
      if (JSON.stringify(productOriginal) === JSON.stringify(product)) {
        handleCancel();
      } else {
        updateProduct(
          product,
          () => {
            handleCancel();
            addToast('Update success', { appearance: 'success' });
          },
          () => {
            addToast('Unable to update the product, please try again later', { appearance: 'error' });
          }
        );
      }
    } else {
      createProduct(
        product,
        () => {
          handleCancel();
          addToast('Create product success', { appearance: 'success' });
        },
        () => {
          addToast('Unable to create the product, please try again later', { appearance: 'error' });
        }
      );
    }
  }

  const handleImageUpload = (image) => {
    setProduct({ ...product, thumbnail: image });
  }

  return (
    <ModalBase
      title={ initProduct ? t('product.update') : t('product.title') }
      className="product-modal"
      content={
        <div>
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
              <TextField
                required
                value={product.name}
                onChange={e => setProduct({...product, name: e.target.value})}
                placeholder={ t('product.productName') }
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
              <TextField
                required
                value={product.count}
                onChange={e => setProduct({...product, count: e.target.value.replace(/^0+/,'')})}
                type="number"
                placeholder={ t('product.productCount') }
                InputProps={{
                  inputProps: { 
                      min: 0,
                  }
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
            <FormControl variant="outlined">
              <InputLabel>{ t('category.heading') }</InputLabel>
              <Select
                value={product.category}
                onChange={e => setProduct({...product, category: e.target.value})}
                label={ t('category.heading') }
              >
                <MenuItem value={null}>
                  <em>{ t('common.none') }</em>
                </MenuItem>
                {
                  storeState.categories.map(category => <MenuItem value={category._id} key={category._id} >{ category.name }</MenuItem>)
                }
              </Select>
            </FormControl>
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                { t('sale.prices') }
              </Typography>
            </div>
            <div className="input price">
              <div className="price-row">
               {
                 product.prices.map((price, idx) => (
                  <div>
                    <TextField
                      required
                      value={price.name}
                      onChange={e => setProductPrices(idx, 'name', e.target.value)}
                      placeholder={ t('product.priceName') }
                    />
                    <TextField
                      required
                      type="number"
                      value={price.value}
                      onChange={e => setProductPrices(idx, 'value', e.target.value.replace(/^0+/,''))}
                      placeholder={ t('product.priceValue') }
                      InputProps={{
                        inputProps: { 
                            min: 0,
                        }
                      }}
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
                { t('product.cost') }
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                type="number"
                value={product.cost}
                onChange={e => setProduct({...product, cost: e.target.value.replace(/^0+/,'')})}
                placeholder={ t('product.productCost') }
                InputProps={{
                  inputProps: { 
                      min: 0,
                  }
                }}
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

export default ProductModal;
