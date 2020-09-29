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
import {
  Delete,
  AmpStories,
} from '@material-ui/icons';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';
import MomentUtils from '@date-io/moment';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';

import OrderModal from './OrderModal';
import SaleSummary from './SaleSummary';
import SaleByStaff from './SaleByStaff';
import { Context as OrderContext } from '../../../../../../context/orderContext';

const SaleReport = () => {
  const { orderState, loadOrder } = useContext(OrderContext);
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

  const [filter, setFilter] = useState(DATE_OPTIONS.TODAY);
  const [startDate, setStartDate] = useState(dateToday);
  const [endDate, setEndDate] = useState(new Date());
  const [curOrder, setCurOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadOrder(startDate.toISOString(), endDate.toISOString());
  }, [startDate, endDate]);

  const sortOrderListByDate = () => orderState.sort((o1, o2) => {
    const d1 = new Date(o1.createdAt);
    const d2 = new Date(o2.createdAt);
    if (d1 > d2) {
      return -1;
    }
    if (d1 < d2) {
      return 1;
    }
    return 0;
  });

  const setDateFilter = (type) => {
    const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
    const day = beforeOneWeek.getDay();
    const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
    const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));

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

    let start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

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
      default:
        break;
    }
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    setDateFilter(filter);
  }, [filter]);

  const handleViewOrder = (order) => {
    setCurOrder(order);
    setOpen(true);
  };

  return (
    <div className="report-sale-tab">
      <Paper elevation={3} className="filters">
        <div>
          <Button
            color={filter === DATE_OPTIONS.TODAY ? 'primary' : 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.TODAY)}
          >
            { t('date.today') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.WEEK ? 'primary' : 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.WEEK)}
          >
            { t('date.thisWeek') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.MONTH ? 'primary' : 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.MONTH)}
          >
            { t('date.thisMonth') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.YEAR ? 'primary' : 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.YEAR)}
          >
            { t('date.thisYear') }
          </Button>
          <Button
            color={filter === DATE_OPTIONS.CUSTOM ? 'primary' : 'default'}
            variant="contained"
            onClick={() => setFilter(DATE_OPTIONS.CUSTOM)}
          >
            { t('report.custom') }
          </Button>
        </div>
        {
          filter === DATE_OPTIONS.CUSTOM && (
            <div className="custom-date">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  label={t('report.startDate')}
                  className="start-date"
                  value={startDate}
                  onChange={(start) => {
                    const pickedStartDate = new Date(start);
                    pickedStartDate.setHours(0, 0, 0, 0);
                    setStartDate(pickedStartDate);
                  }}
                  animateYearScrolling
                  maxDate={new Date()}
                />
                <DatePicker
                  label={t('report.endDate')}
                  className="end-date"
                  value={endDate}
                  onChange={(end) => {
                    const pickedEndDate = new Date(end);
                    pickedEndDate.setHours(23, 59, 59, 999);
                    setEndDate(pickedEndDate);
                  }}
                  animateYearScrolling
                  minDate={new Date(startDate)}
                  maxDate={new Date()}
                />
              </MuiPickersUtilsProvider>
            </div>
          )
        }
      </Paper>

      <div className="content" style={{ height: `${filter === DATE_OPTIONS.CUSTOM ? 'calc(100% - 124px)' : 'calc(100% - 48px)'}` }}>
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
              {
                sortOrderListByDate()
                  .map((order) => (
                    <OrderRow
                      order={order}
                      handleViewOrder={handleViewOrder}
                      key={order._id}
                    />
                  ))
              }
            </TableBody>
          </Table>
        </Paper>

        <div className="flex flex-col">
          <SaleSummary orders={orderState} />
          <SaleByStaff />
        </div>

      </div>

      {
        open && (
          <OrderModal
            order={curOrder}
            closeModal={() => setOpen(false)}
          />
        )
      }
    </div>
  );
};

const OrderRow = ({ order, handleViewOrder }) => {
  const { deleteOrder } = useContext(OrderContext);
  const { addToast } = useToasts();

  const handleDelete = () => {
    deleteOrder(
      { _id: order._id },
      () => {
        addToast('Order deleted success', { appearance: 'success' });
      },
      () => {
        addToast('Unable to delete the order, please try again later', { appearance: 'error' });
      },
    );
  };

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
};

OrderRow.propTypes = {
  order: PropTypes.instanceOf(PropTypes.object).isRequired,
  handleViewOrder: PropTypes.func.isRequired,
};

export default SaleReport;
