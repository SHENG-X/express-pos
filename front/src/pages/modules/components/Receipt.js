import React, {
  useState
} from 'react';
import {
  IconButton,
  Button,
  makeStyles
} from '@material-ui/core';
import {
  Add,
  Remove,
  Delete
} from '@material-ui/icons';

import Paper from './Paper';
import Typography from './Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: '2rem'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const mockProducts = [ 
  {
    _id: '2314124124131232214',
    name: 'Chai Tea Latte',
    count: 1,
    price: 12.45
  },
  {
    _id: '2314123412413654121',
    name: 'Milk Latte',
    count: 1,
    price: 8.45
  },
  {
    _id: '2986753412413654121',
    name: 'Dark Roast',
    count: 2,
    price: 4.45
  },
]

const Receipt = () => {
  const classes = useStyles();
  const [products, setProducts] = useState(mockProducts);
  const [taxRate, setTaxRate] = useState(0.12);

  const deleteProduct = (pid) => {
    const newProducts = products.filter(prod => prod._id !== pid);
    setProducts(newProducts);
  }

  const addRemoveProduct = (action, pid) => {
    let base = 1;
    if (action === 'remove') {
      base = -1;
    }
    const newProducts = products.map(prod => {
      if (prod._id === pid) {
        if (prod.count + base < 1) {
          return prod;
        }
        prod.count += base;
        return prod;
      }
      return prod;
    });
    setProducts(newProducts);
  }

  const calcSubtotal = () => {
    return products.reduce((res, prod) => res += prod.count * prod.price, 0).toFixed(2);
  }

  const calcTax = () => {
    return (taxRate * Number(calcSubtotal())).toFixed(2);
  }

  const calcTotal = () => {
    return (Number(calcSubtotal()) + Number(calcTax())).toFixed(2);
  }

  return (
    <Paper className={classes.paper}>
      <div className="receipt">
        <div className="heading row">
          <div className="col-qty">
            <Typography variant="subtitle1">
              Quantity
            </Typography>
          </div>
          <div className="col-product">
            <Typography variant="subtitle1">
              Product
            </Typography>
          </div>
          <div className="col-price">
            <Typography variant="subtitle1">
              Price
            </Typography>
          </div>
          <div className="col-total">
            <Typography variant="subtitle1">
              Amount
            </Typography>
          </div>
          <div className="col-del">
            <Typography variant="subtitle1">
              Del
            </Typography>
          </div>
        </div>
        <div className="content">
        {
          products.map(prod => <ReceiptItem product={prod} addRemoveProduct={addRemoveProduct} deleteProduct={deleteProduct} />)
        }
        </div>
        <div className="footer">
          <div className="row">
            <div className="col-label">
              <Typography variant="subtitle2">
                Subtotal
              </Typography>
            </div>
            <div className="col-amount">
              <Typography variant="body2">
                { calcSubtotal() }
              </Typography>
            </div>
          </div>
          <div className="row">
            <div className="col-label">
              <Typography variant="subtitle2">
                Sales Tax 12%
              </Typography>
            </div>
            <div className="col-amount">
              <Typography variant="body2">
                { calcTax() }
              </Typography>
            </div>
          </div>
          <div className="row">
            <div className="col-label">
              <Typography variant="subtitle2">
                Receipt Total
              </Typography>
            </div>
            <div className="col-amount">
              <Typography variant="body1">
                { calcTotal() }
              </Typography>
            </div>
          </div>
          <div className="row">
            <Button>
              Cancel
            </Button>
            <Button>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
}

const ReceiptItem = ({ product, addRemoveProduct, deleteProduct }) => {
  return (
    <div class="row">
      <div className="col-qty">
        <IconButton
          color="primary"
          size="small"
          aria-label="add one"
          onClick={() => addRemoveProduct('add', product._id)}
        >
          <Add />
        </IconButton>
        <Typography variant="subtitle2" align="center" className="count">
          { product.count }
        </Typography>
        <IconButton
          color="primary"
          size="small"
          aria-label="remove one"
          onClick={() => addRemoveProduct('remove', product._id)}
        >
          <Remove />
        </IconButton>
      </div>
      <div className="col-product">
        <Typography variant="body1">
          { product.name }
        </Typography>
      </div>
      <div className="col-price">
        <Typography variant="body1">
          { product.price.toFixed(2) }
        </Typography>
      </div>
      <div className="col-total">
        <Typography variant="body1">
          { (product.count * product.price).toFixed(2) }
        </Typography>
      </div>
      <div className="col-del">
        <IconButton
          color="primary"
          size="small"
          aria-label="delete"
          onClick={() => deleteProduct(product._id) }
        >
          <Delete />
        </IconButton>
      </div>
    </div>
  );
}

export default Receipt;