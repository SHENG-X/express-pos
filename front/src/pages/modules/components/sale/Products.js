import React, {
  useContext,
  useState,
} from 'react';
import {
  Input,
  InputAdornment,
  Card,
  CardHeader,
  CardMedia,
  ButtonBase
} from '@material-ui/core';
import {
  Search,
} from '@material-ui/icons';
import { Context } from '../../../../context/storeContext';

const Products = ({ handleOpen }) => {
  const { state } = useContext(Context);
  const [searchText, setSearchText] = useState('');

  const computeProductList = () => {
    let products = state.store.products;
    if (searchText !== '') {
      products = products.filter(prod => prod.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return products.map(prod => prod.enable && <ProductItem product={prod} handleOpen={handleOpen} key={prod._id}/>);
  }

  return (
    <div className="products">
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
          image={require('../../../../static/no-product-image.png')}
          title={product.name}
        />
        <CardHeader
          title={product.name}
        />
      </Card>
    </ButtonBase>
  );
}

export default Products;
