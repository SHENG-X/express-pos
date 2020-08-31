import React, {
  useContext
} from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import {
  Edit,
  Delete,
  AmpStories,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../context/storeContext';
import { formatAsCurrency } from '../../../../utils';

const SaleReport = () => {
  const { state } = useContext(Context);
  const { t } = useTranslation();

  const calcRevenue = () => {
    let totalRevenue = 0;
    state.store.orders.forEach(order => {
      order.products.forEach(product => {
        totalRevenue += product.price;
      });
    });
    return totalRevenue.toFixed(2);
  }

  const calcNetIncome = () => {
    let totalCost = 0;
    state.store.orders.forEach(order => {
      order.products.forEach(product => {
        const productCost = state.store.products.find(prod => prod._id === product.product).cost;
        totalCost += productCost;
      });
    });
    return (calcRevenue() - totalCost).toFixed(2);
  }

  return (
    <div className="sale-tab">
      <Paper elevation={3} >
        <div className="revenue-pan">
          <div className="heading">
            <Button>{ t('date.today') }</Button>
            <Button>{ t('date.thisWeek') }</Button>
            <Button>{ t('date.thisMonth') }</Button>
            <Button>{ t('date.thisYear') }</Button>
          </div>
          <div className="content">
            <div className="col">
              <div className="label">
                <Typography variant="subtitle1">
                  { t('report.revenue') }
                </Typography>
              </div>
              <div className="label">
                <Typography variant="subtitle1">
                  { t('report.netIncome') }
                </Typography>
              </div>
            </div>
            <div className="col">
              <div className="value">
                <Typography variant="subtitle1">  
                  {
                    formatAsCurrency(calcRevenue())
                  }
                </Typography>
              </div>
              <div className="value">
                <Typography variant="subtitle1">
                  {
                    formatAsCurrency(calcNetIncome())
                  }
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Paper>

      <Paper elevation={3} >
        <div className="order-history">
          <div className="row heading">
            <div className="oid">
            <Typography variant="subtitle1">
              { t('report.orderId') }
            </Typography>
            </div>
            <div className="timestamp">
            <Typography variant="subtitle1">
              { t('report.placedTime') }
            </Typography>
            </div>
            <div className="actions">
            <Typography variant="subtitle1">
              { t('common.actions') }
            </Typography>
            </div>
          </div>
          {
            state.store.orders.map(order => <OrderRow order={order} key={order._id}/>)
          }
        </div>
      </Paper>
    </div>
  );
}

const OrderRow = ({ order }) => {

  return (
    <div className="row">
      <div className="oid">
        {
          order._id
        }
      </div>
      <div className="timestamp">
        {
          new Date(order.createdAt).toLocaleString()
        }
      </div>
      <div className="actions">
        <div>
          <IconButton
            color="primary"
            size="small"
          >
            <AmpStories />
          </IconButton>
        </div>
        <div>
          <IconButton
            color="primary"
            size="small"
          >
            <Edit />
          </IconButton>
        </div>
        <div>
          <IconButton
            color="primary"
            size="small"
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default SaleReport;
