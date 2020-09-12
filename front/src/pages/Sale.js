import React, {
  useState,
} from 'react';

import withRoot from './modules/withRoot';
import AppAppBar from './modules/views/AppAppBar';
import Receipt from './modules/components/sale/Receipt';
import Products from './modules/components/sale/Products';
import Categories from './modules/components/sale/Categories';
import ProductModal from './modules/components/sale/ProductModal';

const Sale = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [order, setOrder] = useState([]);
  const [selectedCID, setSelectedCID] = useState('');

  const handleOpen = (product) => {
    setSelectedProduct({...product, price: Math.max(...product.prices)});
    setOpen(true);
  }

  const handleConfirm = (product) => {
    const productAdded = order.find(prod => prod._id === product._id && prod.price === product.price);
    let newOrder = [];
    if (productAdded) {
      newOrder = order.map(prod => {
        if (prod._id === product._id && prod.price === product.price) {
          return {...prod, count: prod.count + product.count};
        }
        return prod;
      })
    } else {
      newOrder = [...order, product];
    }
    setOrder(newOrder);
    setSelectedProduct({});
    setOpen(false);
  }

  const beforeRouteChange = (callback) => {
    if (order.length) {
      if (window.confirm("You have unplaced order. If you navigate away, you will lose you changes.")) {
        callback();
      }
    } else {
      callback();
    }
  }

  const handleSelectChange = (cid) => {
    if (cid === selectedCID) {
      setSelectedCID('');
    } else {
      setSelectedCID(cid);
    }
  }

  return (
    <div className="sale" >
      <React.Fragment>
        <AppAppBar beforeRouteChange={beforeRouteChange}/>
        <div className="container">
          <div className="receipt">
            <Receipt order={order} setOrder={setOrder} />
          </div>
          <div className="products">
            <Products handleOpen={handleOpen} selectedCID={selectedCID} />
          </div>
          <Categories selectedCID={selectedCID} handleSelectChange={handleSelectChange} />
        </div>
        {
          open &&
          <ProductModal
            selectedProduct={selectedProduct}
            handleOpen={val => setOpen(val)}
            handleConfirm={handleConfirm}
          />
        }
      </React.Fragment>
    </div>
  );
}

export default withRoot(Sale);
