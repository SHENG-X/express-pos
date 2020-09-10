import React, {
  useContext,
} from 'react';
import {
  Typography,
  Paper,
} from '@material-ui/core';
import { Context } from '../../../../context/storeContext';

const InventoryReport = () => {
  return (
    <div className="sale-tab">
      <InventorySummary/>
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

  return (
    <Paper
      elevation={3}
      className="inventory-summary"
    > 
      <div className="heading">
        <Typography variant="subtitle1">
          Inventory Summary
        </Typography>
      </div>

      <div className="content">
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
      </div>
    </Paper>
  );
}

export default InventoryReport;
