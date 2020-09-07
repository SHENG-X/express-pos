import React, {
  useState,
  useContext
} from 'react';
import {
  Input,
  InputAdornment,
  Typography,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
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

import { Context } from '../../../../context/storeContext';
import ProductModal from './ProductModal';
import RestockModal from './RestockModal';
import { formatAsCurrency } from '../../../../utils';

const Product = () => {
  const { state } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setOpen(true);
  }

  const editProduct = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  }

  const restockProduct = (product) => {
    setCurrentProduct(product);
    setRestockOpen(true);
  }

  const computeList = () => {
    let products = state.store.products;
    if (searchText !== '') {
      products = products.filter(prod => prod.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return products.map(prod =>
      <ProductRow 
        product={prod}
        editProduct={editProduct}
        restockProduct={restockProduct}
        key={prod._id}
      />
    );
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
            color="primary"
            variant="contained"
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
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <div className="table-container">
          <Table stickyHeader className="table">
            <TableHead>
              <TableRow>
                <TableCell>{ t('common.img') }</TableCell>
                <TableCell>{ t('common.name') }</TableCell>
                <TableCell>{ t('common.count') }</TableCell>
                <TableCell>{ t('category.heading') }</TableCell>
                <TableCell>{ t('sale.prices') }</TableCell>
                <TableCell>{ t('product.cost') }</TableCell>
                <TableCell>{ t('common.actions') }</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { computeList() }
            </TableBody>
          </Table>
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
      {
        restockOpen ?
        <RestockModal
          handleOpen={val => setRestockOpen(val)}
          product={currentProduct}
        />
        :
        null
      }
    </React.Fragment>
  );
}

const ProductRow = ({ product, editProduct, restockProduct }) => {
  const { state, deleteProduct, updateProduct } = useContext(Context);

  const computeCategoryName = () => {
    const category = state.store.categories.find(category => category._id === product.category);
    if (category) {
      return category.name;
    }
    return '';
  }

  return (
    <TableRow>
      <TableCell>
        <div
          className="thumbnail"
          title={product.name}
          style={{"backgroundImage": `url(/static/media/no-product-image.b51a7162.png)`}}
        />
      </TableCell>
      <TableCell>
        { product.name }
      </TableCell>
      <TableCell>
        { product.count }
      </TableCell>
      <TableCell>
        { computeCategoryName() }
      </TableCell>
      <TableCell>
        {
          product.prices.map(price => (
            <div className="price-item" key={`${price.name}-${price.value}`}>
              <div className={`name ${price.name ? '' : 'hidden' }`}>{ price.name }</div>
              <div className={`separator ${price.name ? '' : 'hidden' }`}>-</div>
              <div className="value">{ formatAsCurrency(price.value) }</div>
            </div>
          ))
        }
      </TableCell>
      <TableCell>
        { formatAsCurrency(product.cost) }
      </TableCell>
      <TableCell>
        <div className="actions">
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
              onClick={() => restockProduct(product)}
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
                onClick={() => updateProduct(
                  {...product, enable: false},
                  () => {
                    // TODO: handle success
                  },
                  () => {
                    // TODO: handle failed
                  }
                )}
              >
                <Visibility />
              </IconButton>
            </div>
            :
            <div>
              <IconButton
                color="primary"
                size="small"
                onClick={() => updateProduct(
                  {...product, enable: true},
                  () => {
                    // TODO: handle success
                  },
                  () => {
                    // TODO: handle failed
                  }
                )}
              >
                <VisibilityOff />
              </IconButton>
            </div>
          }
          <div>
            <IconButton
              color="primary"
              size="small"
              onClick={() => deleteProduct(
                { _id: product._id },
                () => {
                  // TODO: handle delete product success
                },
                () => {
                  // TODO: handle delete product failed
                }
              )}
            >
              <Delete />
            </IconButton>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default Product;
