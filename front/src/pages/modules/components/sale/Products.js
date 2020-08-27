import React, {
  useState
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
import Typography from '../Typography';

const mockProducts = [ 
  {
    _id: '2314124124131232214',
    name: 'Chai Tea Latte',
    count: 1,
    prices: [12.45, 10.31, 8.24]
  },
  {
    _id: '2314123412413654121',
    name: 'Milk Latte',
    count: 1,
    prices: [8.24, 7.85, 6.24]
  },
  {
    _id: '2986753412413654121',
    name: 'Dark Roast',
    count: 1,
    prices: [4.45, 3.98, 3.56]
  },
];

const Products = ({ handleOpen }) => {
  const [products, setProducts] = useState(mockProducts);

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
        />
      </div>
      <div className="list-container">
        <div className="list">
          {
            products.map(prod => <ProductItem product={prod} handleOpen={handleOpen} key={prod._id}/>)
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
          // subheader="September 14, 2016"
        />
      </Card>
    </ButtonBase>
  );
}

export default Products;
