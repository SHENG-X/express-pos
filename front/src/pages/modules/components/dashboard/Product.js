import React, {
  useState,
  useContext
} from 'react';
import {
  Input,
  InputAdornment,
  Typography,
  IconButton,
} from '@material-ui/core';
import {
  Search,
  Edit,
  Storage,
  Delete,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Paper from '../Paper';
import Button from '../Button';
import { Context } from '../../../../context/storeContext';
import ProductModal from './ProductModal';
import { formatAsCurrency } from '../../../../utils';

const Product = ({ handleOpen }) => {
  const { state } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { t } = useTranslation();

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setOpen(true);
  }

  const editProduct = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  }

  return (
    <React.Fragment>
      <Paper elevation={3} className="product-tab">

        <div className="heading">
          <Typography variant="subtitle1">
            { t('product.heading') }
          </Typography>
        </div>
        <div className="actions">
          <Button
            onClick={handleAddProduct}
          >
            { t('product.addNew') }
          </Button>
          <div className="search">
            <Input
              placeholder={ t('product.search') }
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </div>
        </div>
        <div className="content">
          <div className="row heading">
            <div className="col-img">
              <Typography variant="subtitle1">
                { t('common.img') }
              </Typography>
            </div>
            <div className="col-name">
              <Typography variant="subtitle1">
                { t('common.name') }
              </Typography>
            </div>
            <div className="col-count">
              <Typography variant="subtitle1">
                { t('common.count') }
              </Typography>
            </div>
            <div className="col-category">
              <Typography variant="subtitle1">
                { t('category.heading') }
              </Typography>
            </div>
            <div className="col-prices">
              <Typography variant="subtitle1">
                { t('sale.prices') }
              </Typography>
            </div>
            <div className="col-cost">
              <Typography variant="subtitle1">
                { t('product.cost') }
              </Typography>
            </div>
            <div className="col-actions">
              <Typography variant="subtitle1">
                { t('common.actions') }
              </Typography>
            </div>
          </div>
          <div className="list">
              {
                state.store.products.map(prod => <ProductRow product={prod} editProduct={editProduct} key={prod._id}/>)
              }
          </div>
        </div>
      </Paper>
      {
        open ?
        <ProductModal
          handleOpen={val => setOpen(val)}
          initProduct={currentProduct}
        />
        :
        null
      }
    </React.Fragment>
  );
}

const ProductRow = ({ product, editProduct }) => {
  const { state, deleteProduct, updateProduct } = useContext(Context);

  const computeCategoryName = () => {
    const category = state.store.categories.find(category => category._id === product.category);
    if (category) {
      return category.name;
    }
    return '';
  }

  return (
    <div className="row">
      <div className="col-img">
        <div
          className=""
          title={product.name}
          style={{"backgroundImage": `url(/static/media/no-product-image.b51a7162.png)`}}
        />
      </div>
      <div className="col-name">
        { product.name }
      </div>
      <div className="col-count">
        { product.count }
      </div>
      <div className="col-category">
        { 
          computeCategoryName()
        }
      </div>
      <div className="col-prices">
        { 
          product.prices.map(price => (
            <div className="price-item">
              <div className="name">{ price.name }</div>
              <div className="separator">-</div>
              <div className="value">{ formatAsCurrency(price.value) }</div>
            </div>
          ))
        }
      </div>
      <div className="col-cost">
        { formatAsCurrency(product.cost) }
      </div>
      <div className="col-actions">
        <div>
          <IconButton
            color="primary"
            size="small"
            onClick={() => editProduct(product)}
          >
            <Edit />
          </IconButton>
        </div>
        <div>
          <IconButton
            color="primary"
            size="small"
          >
            <Storage />
          </IconButton>
        </div>
        {
          product.enable ?
          <div>
            <IconButton
              color="primary"
              size="small"
              onClick={() => updateProduct({...product, enable: false})}
            >
              <Visibility />
            </IconButton>
          </div>
          :
          <div>
            <IconButton
              color="primary"
              size="small"
              onClick={() => updateProduct({...product, enable: true})}
            >
              <VisibilityOff />
            </IconButton>
          </div>
        }
        <div>
          <IconButton
            color="primary"
            size="small"
            onClick={() => deleteProduct({ _id: product._id, store: state.store._id })}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Product;
