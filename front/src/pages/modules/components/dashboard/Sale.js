import React, {
  useContext
} from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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

  const computeOrderList = () => {
    // sort orders by created time,the latest order is
    // displayed at the top row of the table
    let orders = state.store.orders.sort((o1, o2) => {
      const d1 = new Date(o1.createdAt);
      const d2 = new Date(o2.createdAt);
      if (d1 > d2) {
        return -1;
      }
      if (d1 < d2) {
        return  1;
      }
      return 0;
    });
    return orders.map(order => <OrderRow order={order} key={order._id}/>);
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
        <Table className="table">
          <TableHead className="header">
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1">
                  { t('report.orderId') }
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  { t('report.placedTime') }
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  { t('common.actions') }
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { computeOrderList() }
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

const OrderRow = ({ order }) => {

  return (
    <TableRow>
      <TableCell>
        { order._id }
      </TableCell>
      <TableCell>
        { new Date(order.createdAt).toLocaleString() }
      </TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  );
}

export default SaleReport;
