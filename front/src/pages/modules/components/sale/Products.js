import React, {
  useContext,
  useState,
} from 'react';
import {
  Input,
  InputAdornment,
  Card,
  CardMedia,
  ButtonBase,
  Typography,
} from '@material-ui/core';
import {
  Search,
} from '@material-ui/icons';
import { Context } from '../../../../context/storeContext';
import { imagePath } from '../../../../utils';

const Products = ({ handleOpen, selectedCID }) => {
  const { storeState } = useContext(Context);
  const [searchText, setSearchText] = useState('');

  const computeProductList = () => {
    let products = storeState.products;

    if (selectedCID !== '') {
      // if filter by category is selected then filter by category first
      products = products.filter(prod => prod.category === selectedCID);
    }
    if (searchText !== '') {
      products = products.filter(prod => prod.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return products.map(prod => prod.enable && <ProductItem product={prod} handleOpen={handleOpen} key={prod._id}/>);
  }

  return (
    <div className="container">
      <div className="search">
        <Input
          placeholder="Search for a product"
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      <div className="list-container">
        <div className="list">
          {
            computeProductList()
          }
        </div>
      </div>
    </div>
  );
}

const ProductItem = ({ product, handleOpen }) => {
  return (
    <ButtonBase
      className="card-button"
      onClick={() => handleOpen(product)}
    >
      <Card className="card">
        <CardMedia
          className="media"
          image={ product.thumbnailFileName ? imagePath(product.thumbnailFileName) : require('../../../../static/no-product-image.png')}
          title={product.name}
        />
        <Typography variant="subtitle2">
          { product.name }
        </Typography>
      </Card>
    </ButtonBase>
  );
}

export default Products;
