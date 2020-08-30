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
import Paper from '../Paper';
import Button from '../Button';
import { Context } from '../../../../context/storeContext';
import ProductModal from './ProductModal';

const Product = ({ handleOpen }) => {
  const { state } = useContext(Context);
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <Paper elevation={3} className="product-tab">

        <div className="heading">
          <Typography variant="subtitle1">
            Products
          </Typography>
        </div>
        <div className="actions">
          <Button
            onClick={() => setOpen(true)}
          >
            Add new product
          </Button>
          <div className="search">
            <Input
              placeholder="Search for a product"
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
                IMG
              </Typography>
            </div>
            <div className="col-name">
              <Typography variant="subtitle1">
                Name
              </Typography>
            </div>
            <div className="col-count">
              <Typography variant="subtitle1">
                Count
              </Typography>
            </div>
            <div className="col-category">
              <Typography variant="subtitle1">
                Category
              </Typography>
            </div>
            <div className="col-prices">
              <Typography variant="subtitle1">
                Prices
              </Typography>
            </div>
            <div className="col-cost">
              <Typography variant="subtitle1">
                Cost
              </Typography>
            </div>
            <div className="col-actions">
              <Typography variant="subtitle1">
                Actions
              </Typography>
            </div>
          </div>
          <div className="list">
              {
                state.store.products.map(prod => <ProductRow product={prod} key={prod._id}/>)
              }
          </div>
        </div>
      </Paper>
      {
        open ?
        <ProductModal
          handleOpen={val => setOpen(val)}
        />
        :
        null
      }
    </React.Fragment>
  );
}

const ProductRow = ({ product }) => {
  const { state, deleteProduct, updateProduct } = useContext(Context);
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
        { product.category }
      </div>
      <div className="col-prices">
        { 
          product.prices.map(price => (
            <div>
              <span>{ price.name }</span> - <span>{price.value}</span>
            </div>
          ))
        }
      </div>
      <div className="col-cost">
        { product.cost }
      </div>
      <div className="col-actions">
        <div>
          <IconButton
            color="primary"
            size="small"
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
