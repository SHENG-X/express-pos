import React, {
  useContext,
} from 'react';
import {
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { Context as StoreContext } from '../../../../../../context/storeContext';
import { formatAsCurrency, imagePath } from '../../../../../../utils';
import CardBase from '../../../cardbase/CardBase';

const InventoryReport = () => (
  <div className="sale-tab">
    <div className="row">
      <InventorySummary />
      <TopSelling />
    </div>
  </div>
);

const InventorySummary = () => {
  const { storeState } = useContext(StoreContext);

  const computeProducts = () => storeState.products.reduce((acc, prod) => acc + prod.count, 0);

  const computeDisabledProducts = () => storeState.products
    .reduce((acc, prod) => acc + (prod.enable ? 0 : 1), 0);

  const computeCategories = () => storeState.categories.length;

  const computeTotalAsset = () => storeState.products
    .reduce((acc, prod) => (
      [acc[0] + Math.max(...prod.prices.map((price) => price.value)) * prod.count, acc[1]
      + prod.cost * prod.count]
    ),
    [0, 0]);

  return (
    <CardBase
      title="Inventory Summary"
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
};

const TopSelling = () => {
  const { storeState } = useContext(StoreContext);

  const computeTopSelling = (count = 3) => {
    const products = storeState.products
      .filter((prod) => prod.sold)
      .sort((p1, p2) => p2.sold - p1.sold);
    return products.slice(0, count);
  };

  return (
    <CardBase
      title="Top Selling Products"
      className="top-selling"
    >
      {
        computeTopSelling().map((topSelling) => (
          <TopSellingCard
            topSelling={topSelling}
            key={topSelling._id}
          />
        ))
      }
    </CardBase>
  );
};

const TopSellingCard = ({ topSelling }) => (
  <div className="card">
    <div
      className="media"
      title={topSelling.name}
      style={{ backgroundImage: `url(${topSelling.thumbnailFileName ? imagePath(topSelling.thumbnailFileName) : '/static/media/no-product-image.b51a7162.png'})` }}
    />
    <div className="name">
      <Typography variant="subtitle2">
        { topSelling.name }
      </Typography>
    </div>
    <div className="count">
      { topSelling.sold }
      &nbspSold
    </div>
  </div>
);

TopSellingCard.propTypes = {
  topSelling: PropTypes.instanceOf(PropTypes.object).isRequired,
};

export default InventoryReport;
