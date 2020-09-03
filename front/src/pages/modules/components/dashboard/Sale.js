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
  Edit,
  Delete,
  AmpStories,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

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
  const [ filteredList, setFilteredList] = useState([]);
  const [startDate, setStartDate] = useState(dateToday);
  const [endDate, setEndDate] = useState(new Date());
  const [curOrder, setCurOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFilteredList(filterDate(filter));
  }, [filter, startDate, endDate]);

  const calcRevenue = () => {
    let totalRevenue = 0;
    filteredList.forEach(order => {
      order.products.forEach(product => {
        totalRevenue += product.price;
      });
    });
    return totalRevenue.toFixed(2);
  }

  const calcNetIncome = () => {
    let totalCost = 0;
    filteredList.forEach(order => {
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
    let orders = filteredList.sort((o1, o2) => {
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

  const filterDate = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevMonday = new Date();
    prevMonday.setHours(0, 0, 0, 0);
    prevMonday.setDate(prevMonday.getDate() - prevMonday.getDay() + 1);

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
        start = new Date(prevMonday);
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
        return state.store.orders.filter(d => (d.createdAt >= start.toISOString() && d.createdAt <= end.toISOString()));
    }
    return state.store.orders.filter(d => d.createdAt > start.toISOString());
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
            color={filter === DATE_OPTIONS.TODAY ? 'primary': ''}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.TODAY)}
          >
            { t('date.today') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.WEEK ? 'primary': ''}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.WEEK)}
          >
            { t('date.thisWeek') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.MONTH ? 'primary': ''}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.MONTH)}
          >
            { t('date.thisMonth') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.YEAR ? 'primary': ''}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.YEAR)}
          >
            { t('date.thisYear') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.CUSTOM ? 'primary': ''}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.CUSTOM)}
          >
            Custom
          </Button>
        </div>
        {
          filter === DATE_OPTIONS.CUSTOM ?
          <div className="custom-date">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label="Start date"
                className="start-date"
                value={startDate}
                onChange={setStartDate}
                animateYearScrolling
                maxDate={new Date()}
              />
              <DatePicker
                label="End date"
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
