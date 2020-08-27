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
  Visibility
} from '@material-ui/icons';
import Paper from '../Paper';
import Button from '../Button';
import { Context } from '../../../../context/storeContext';
import ProductModal from './ProductModal';

const mockProducts = [ 
  {
    _id: '2314124124131232214',
    name: 'Chai Tea Latte',
    enable: true,
    category: 'Tea',
    count: 50,
    prices: [12.45, 10.31, 8.24],
    cost: 6.25
  },
  {
    _id: '2314123412413654121',
    name: 'Milk Latte',
    enable: true,
    count: 100,
    prices: [8.24, 7.85, 6.24],
    cost: 4.75
  },
  {
    _id: '2986753412413654121',
    name: 'Dark Roast',
    enable: true,
    category: 'Coffee',
    count: 60,
    prices: [4.45, 3.98, 3.56],
    cost: 2.45
  },
  {
    _id: '2986753487453654121',
    name: 'Medium Roast',
    enable: false,
    category: 'Coffee',
    count: 80,
    prices: [4.45, 3.98, 3.56],
    cost: 2.35
  },
];

const Product = ({ handleOpen }) => {
  const [products, setProducts] = useState(mockProducts);
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
                products.map(prod => prod.enable && <ProductRow product={prod} key={prod._id}/>)
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
        { product.prices }
      </div>
      <div className="col-cost">
        { product.cost }
      </div>
      <div className="col-actions">
        <IconButton
          color="primary"
          size="small"
        >
          <Edit />
        </IconButton>
        <IconButton
          color="primary"
          size="small"
        >
          <Storage />
        </IconButton>
        <IconButton
          color="primary"
          size="small"
        >
          <Visibility />
        </IconButton>
        <IconButton
          color="primary"
          size="small"
        >
          <Delete />
        </IconButton>
      </div>
    </div>
  );
}

export default Product;
