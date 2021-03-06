import React, {
  useState,
  useContext,
} from 'react';
import {
  Input,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
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
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';

import { Context } from '../../../../../context/storeContext';
import ProductModal from './ProductModal';
import RestockModal from './RestockModal';
import { formatAsCurrency, classNames, imagePath } from '../../../../../utils';
import CardBase from '../../cardbase/CardBase';

const Product = () => {
  const { storeState } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setOpen(true);
  };

  const editProduct = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const restockProduct = (product) => {
    setCurrentProduct(product);
    setRestockOpen(true);
  };

  const computeList = () => {
    let { products } = storeState;
    if (searchText !== '') {
      products = products.filter((prod) => (
        prod.name.toLowerCase().includes(searchText.toLowerCase())
      ));
    }
    return products.map((prod) => (
      <ProductRow
        product={prod}
        editProduct={editProduct}
        restockProduct={restockProduct}
        key={prod._id}
      />
    ));
  };

  return (
    <>
      <CardBase
        title={t('product.heading')}
        className="product-tab"
      >
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
              placeholder={t('product.search')}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
              onChange={(e) => setSearchText(e.target.value)}
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
      </CardBase>
      {
        open && (
          <ProductModal
            handleOpen={(val) => setOpen(val)}
            initProduct={currentProduct}
          />
        )
      }
      {
        restockOpen && (
          <RestockModal
            handleOpen={(val) => setRestockOpen(val)}
            product={currentProduct}
          />
        )
      }
    </>
  );
};

const ProductRow = ({ product, editProduct, restockProduct }) => {
  const { storeState, deleteProduct, updateProduct } = useContext(Context);
  const { addToast } = useToasts();

  const computeCategoryName = () => {
    const category = storeState.categories.find((item) => item._id === product.category);
    if (category) {
      return category.name;
    }
    return '';
  };

  return (
    <TableRow>
      <TableCell key={product.key}>
        {
          product.thumbnailFileName ? (
            <div
              className="thumbnail"
              title={product.name}
              style={{ backgroundImage: `url(${imagePath(product.thumbnailFileName)})` }}
            />
          ) : (
            <div
              className="thumbnail"
              title={product.name}
              style={{ backgroundImage: 'url(/static/media/no-product-image.b51a7162.png)' }}
            />
          )
        }
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
          product.prices.map((price) => (
            <div className="price-item" key={`${price.name}-${price.value}`}>
              <div className={classNames(['name', price.name ? '' : 'hidden'])}>{ price.name }</div>
              <div className={classNames(['separator', price.name ? '' : 'hidden'])}>-</div>
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
            <Tooltip
              title="Edit"
              arrow
            >
              <IconButton
                color="primary"
                size="small"
                onClick={() => editProduct(product)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title="Restock"
              arrow
            >
              <IconButton
                color="primary"
                size="small"
                onClick={() => restockProduct(product)}
              >
                <Storage />
              </IconButton>
            </Tooltip>
          </div>
          {
            product.enable ? (
              <div>
                <Tooltip
                  title="Disable"
                  arrow
                >
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => updateProduct(
                      { ...product, enable: false },
                      () => {
                        addToast('Disable product success', { appearance: 'success' });
                      },
                      () => {
                        addToast('Unable to disable the product, please try again later', { appearance: 'error' });
                      },
                    )}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </div>
            ) : (
              <div>
                <Tooltip
                  title="Enable"
                  arrow
                >
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => updateProduct(
                      { ...product, enable: true },
                      () => {
                        addToast('Enable product success', { appearance: 'success' });
                      },
                      () => {
                        addToast('Unable to enable the product, please try again later', { appearance: 'error' });
                      },
                    )}
                  >
                    <VisibilityOff />
                  </IconButton>
                </Tooltip>
              </div>
            )
          }
          <div>
            <Tooltip
              title="Delete"
              arrow
            >
              <IconButton
                color="primary"
                size="small"
                onClick={() => deleteProduct(
                  { _id: product._id },
                  () => {
                    addToast('Delete product success', { appearance: 'success' });
                  },
                  () => {
                    addToast('Unable to delete the product, please try again later', { appearance: 'error' });
                  },
                )}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

ProductRow.propTypes = {
  product: PropTypes.instanceOf(PropTypes.object).isRequired,
  editProduct: PropTypes.func.isRequired,
  restockProduct: PropTypes.func.isRequired,
};

export default Product;
