import React, {
  useContext,
} from 'react';
import {
  Typography,
} from '@material-ui/core';
import { Context } from '../../../../context/storeContext';
import { formatAsCurrency, imagePath } from '../../../../utils';
import CardBase from '../cardbase/CardBase';

const InventoryReport = () => {
  return (
    <div className="sale-tab">
      <div className="row">
        <InventorySummary/>
        <TopSelling/>
      </div>
    </div>
  );
}

const InventorySummary = () => {
  const { state } = useContext(Context);

  const computeProducts = () => {
    return state.store.products.reduce((acc, prod) => acc + prod.count, 0);
  }

  const computeDisabledProducts = () => {
    return state.store.products.reduce((acc, prod) => acc + (prod.enable ? 0 : 1), 0);
  }

  const computeCategories = () => {
    return state.store.categories.length;
  }

  const computeTotalAsset = () => {
    return state.store.products.reduce((acc, prod) => [acc[0] + Math.max(...prod.prices.map(price => price.value)) * prod.count, acc[1] + prod.cost * prod.count], [0, 0]);
  }

  return (
    <CardBase
      title={'Inventory Summary'}
      className="inventory-summary"
    >
      <div className="row">
          <div className="label">
            <Typography variant="body2">
              All Products
            </Typography>
          </div>
          <div className="value">
            <Typography variant="subtitle2">
              { computeProducts() }
            </Typography>
          </div>
        </div>

        <div className="row">
          <div className="label">
            <Typography variant="body2">
              Disabled Products
            </Typography>
          </div>
          <div className="value">
            <Typography variant="subtitle2">
              { computeDisabledProducts() }
            </Typography>
          </div>
        </div>

        <div className="row">
          <div className="label">
            <Typography variant="body2">
              All Categories
            </Typography>
          </div>
          <div className="value">
            <Typography variant="subtitle2">
              { computeCategories() }
            </Typography>
          </div>
        </div>

        <div className="row">
          <div className="label">
            <Typography variant="body2">
              Total Asset (Gross)
            </Typography>
          </div>
          <div className="value">
            <Typography variant="subtitle2">
              { formatAsCurrency(computeTotalAsset()[0]) }
            </Typography>
          </div>
        </div>

        <div className="row">
          <div className="label">
            <Typography variant="body2">
              Total Asset (Net)
            </Typography>
          </div>
          <div className="value">
            <Typography variant="subtitle2">
              { formatAsCurrency(computeTotalAsset()[1]) }
            </Typography>
          </div>
        </div>
    </CardBase>
  );
}

const TopSelling = () => {
  const { state } = useContext(Context);

  const computeTopSelling = (count = 3) => {
    const productMap = {};
    state.store.orders.forEach(order => {
      order.products.forEach(prod => {
        if (productMap[prod.product]) {
          productMap[prod.product] += prod.count;
        } else {
          productMap[prod.product] = 1;
        }
      });
    });
    let products = [];
    for (const prod in productMap) {
      products.push([prod, productMap[prod]])
    }
    products = products.sort((p1, p2) => p2[1] - p1[1]);

    return products.slice(0, count);
  }

  return (
    <CardBase
      title={'Top Selling Products'}
      className="top-selling"
    >
      { 
        computeTopSelling().map(topSelling => 
          <TopSellingCard topSelling={topSelling} key={topSelling[0]}/>
        )
      }
    </CardBase>
  );
}

const TopSellingCard = ({ topSelling }) => {
  const { state } = useContext(Context);

  const computedProduct = () => {
    return state.store.products.find(product => product._id === topSelling[0]);
  }

  return (
    <div className="card">
      <div 
        className="media"
        title={computedProduct()?.name}
        style={{"backgroundImage": `url(${computedProduct()?.thumbnailFlag ? imagePath(topSelling[0]): '/static/media/no-product-image.b51a7162.png'})`}}
      />
      <div className="name">
        <Typography variant="subtitle2">
          { computedProduct(topSelling[0])?.name }
        </Typography>
      </div>
      <div className="count">
        { topSelling[1] } Sold
      </div>
    </div>
  );
}

export default InventoryReport;
