import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import CardBase from '../../../cardbase/CardBase';
import { formatAsCurrency } from '../../../../../../utils';

const SaleSummary = ({ orders }) => {
  const { t } = useTranslation();

  const calcRevenue = () => {
    let totalRevenue = 0;
    orders.forEach((order) => {
      order.products.forEach((product) => {
        totalRevenue += product.price * product.count;
      });
    });
    return Number(totalRevenue.toFixed(2));
  };

  const calcDiscounted = () => {
    let totalDiscount = 0;
    orders.forEach((order) => {
      if (order.discount) {
        if (order.discount.method === 'Percent') {
          const orderTotal = order.products
            .reduce((acc, product) => acc + product.price * product.count, 0);
          totalDiscount += orderTotal * order.discount.value;
        } else if (order.discount.method === 'Amount') {
          totalDiscount += Number(order.discount.value);
        }
      }
    });
    return totalDiscount * -1;
  };

  const calcTotalCost = () => {
    let totalCost = 0;
    orders.forEach((order) => {
      order.products.forEach((product) => {
        totalCost += product.cost * product.count;
      });
    });
    return totalCost * -1;
  };

  const calcNetIncome = () => (calcRevenue() + calcTotalCost() + calcDiscounted()).toFixed(2);

  return (
    <CardBase
      title="Sale Summary"
      className="report-sale-summary"
    >
      <div className="col">
        <div className="label">
          <Typography variant="body1">
            { t('report.revenue') }
          </Typography>
        </div>
        <div className="label">
          <Typography variant="body1">
            Discounted
          </Typography>
        </div>
        <div className="label">
          <Typography variant="body1">
            Net Cost
          </Typography>
        </div>
        <div className="label">
          <Typography variant="body1">
            { t('report.netIncome') }
          </Typography>
        </div>
      </div>
      <div className="col">
        <div className="value">
          <Typography variant="body1">
            {
              formatAsCurrency(calcRevenue())
            }
          </Typography>
        </div>
        <div className="value">
          <Typography variant="body1">
            {
              formatAsCurrency(calcDiscounted())
            }
          </Typography>
        </div>
        <div className="value">
          <Typography variant="body1">
            {
              formatAsCurrency(calcTotalCost())
            }
          </Typography>
        </div>
        <div className="value">
          <Typography variant="body1">
            {
              formatAsCurrency(calcNetIncome())
            }
          </Typography>
        </div>
      </div>
    </CardBase>
  );
};

SaleSummary.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.instanceOf(PropTypes.object)).isRequired,
};

export default SaleSummary;
