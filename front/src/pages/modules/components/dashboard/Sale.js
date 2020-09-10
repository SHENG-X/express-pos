import React, {
  useContext,
  useState,
  useEffect,
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
import { DatePicker } from "@material-ui/pickers";
import {
  Delete,
  AmpStories,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { useToasts } from 'react-toast-notifications';

import { Context } from '../../../../context/storeContext';
import { formatAsCurrency } from '../../../../utils';
import OrderModal from './OrderModal';

const SaleReport = () => {
  const { state } = useContext(Context);
  const { t } = useTranslation();
  const DATE_OPTIONS = {
    TODAY: 'TODAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH',
    YEAR: 'YEAR',
    CUSTOM: 'CUSTOM',
  };
  const dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);

  const [ filter, setFilter ] = useState(DATE_OPTIONS.TODAY);
  const [startDate, setStartDate] = useState(dateToday);
  const [endDate, setEndDate] = useState(new Date());
  const [curOrder, setCurOrder] = useState(null);
  const [open, setOpen] = useState(false);

  const calcRevenue = () => {
    let totalRevenue = 0;
    filterDate(filter, state.store.orders).forEach(order => {
      order.products.forEach(product => {
        totalRevenue += product.price * product.count;
      });
    });
    return totalRevenue.toFixed(2);
  }

  const calcNetIncome = () => {
    let totalCost = 0;
    filterDate(filter, state.store.orders).forEach(order => {
      order.products.forEach(product => {
        totalCost += product.cost * product.count;
      });
    });
    return (calcRevenue() - totalCost).toFixed(2);
  }

  const computeOrderList = () => {
    // sort orders by created time,the latest order is
    // displayed at the top row of the table
    let orders = filterDate(filter, state.store.orders).sort((o1, o2) => {
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
    return orders.map(order => <OrderRow order={order} handleViewOrder={handleViewOrder} key={order._id}/>);
  }

  const filterDate = (type, orders) => {

    const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
    , day = beforeOneWeek.getDay()
    , diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
    , lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
    , lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    lastMonday.setHours(0, 0, 0, 0);

    const curMonthStart = new Date();
    curMonthStart.setHours(0, 0, 0, 0);
    curMonthStart.setDate(0);

    const curYearStart = new Date();
    curYearStart.setHours(0, 0, 0, 0);
    curYearStart.setMonth(0);
    curYearStart.setDate(0);

    let start = today;

    switch (type) {
      case DATE_OPTIONS.TODAY:
        break;
      case DATE_OPTIONS.WEEK:
        start = new Date(lastMonday);
        break;
      case DATE_OPTIONS.MONTH:
        start = new Date(curMonthStart);
        break;
      case DATE_OPTIONS.YEAR:
        start = new Date(curYearStart);
        break;
      case DATE_OPTIONS.CUSTOM:
        start = new Date(startDate);
        const end = new Date(endDate);
        // end date set hour to the last second of the day
        end.setHours(23, 59, 59, 999);
        // only return date ISOString within the start and end range
        return orders.filter(d => (d.createdAt >= start.toISOString() && d.createdAt <= end.toISOString()));
    }
    return orders.filter(d => d.createdAt > start.toISOString());
  }

  const handleViewOrder = (order) => {
    setCurOrder(order);
    setOpen(true);
  }

  return (
    <div className="sale-tab">
      <Paper elevation={3} className="filters">
        <div>
          <Button
            color={filter === DATE_OPTIONS.TODAY ? 'primary': 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.TODAY)}
          >
            { t('date.today') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.WEEK ? 'primary': 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.WEEK)}
          >
            { t('date.thisWeek') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.MONTH ? 'primary': 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.MONTH)}
          >
            { t('date.thisMonth') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.YEAR ? 'primary': 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.YEAR)}
          >
            { t('date.thisYear') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.CUSTOM ? 'primary': 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.CUSTOM)}
          >
            { t('report.custom') }
          </Button>
        </div>
        {
          filter === DATE_OPTIONS.CUSTOM ?
          <div className="custom-date">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label={ t('report.startDate') }
                className="start-date"
                value={startDate}
                onChange={setStartDate}
                animateYearScrolling
                maxDate={new Date()}
              />
              <DatePicker
                label={ t('report.endDate') }
                className="end-date"
                value={endDate}
                onChange={setEndDate}
                animateYearScrolling
                minDate={new Date(startDate)}
                maxDate={new Date()}
              />
            </MuiPickersUtilsProvider>
          </div>
          :
          null
        }
      </Paper>

      <div className="content" style={{height: `${filter === DATE_OPTIONS.CUSTOM ? 'calc(100% - 90px)': 'calc(100% - 24px)'}`}}>
        <Paper elevation={3} className="orders">
          <Table stickyHeader className="table">
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

        <Paper elevation={3} className="status">
          <div className="revenue-pan">
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

      </div>

      {
        open ?
        <OrderModal order={curOrder} closeModal={() => setOpen(false)}/>
        :
        null
      }
    </div>
  );
}

const OrderRow = ({ order, handleViewOrder }) => {
  const { deleteOrder } = useContext(Context);
  const { addToast } = useToasts();

  const handleDelete = () => {
    deleteOrder(
      { _id: order._id },
      () => {
        addToast('Order deleted success', { appearance: 'success' });
      },
      () => {
        addToast('Unable to delete the order, please try again later', { appearance: 'error' });
      }
    );
  }

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
              onClick={() => handleViewOrder(order)}
            >
              <AmpStories />
            </IconButton>
          </div>
          <div>
            <IconButton
              color="primary"
              size="small"
              onClick={handleDelete}
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
