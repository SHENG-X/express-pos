import React, {
  useRef,
  useEffect,
  useContext,
} from 'react';
import Chart from 'chart.js';
import * as d3 from 'd3';

import CardBase from '../../../cardbase/CardBase';
import { Context } from '../../../../../../context/orderContext';
import { fmtStaffNo, interpolateColors } from '../../../../../../utils';

const SaleByStaff = () => {
  const chartRef = useRef();
  const { orderState } = useContext(Context);

  const computeSaleByStaff = () => {
    const saleByStaff = {};
    orderState.forEach((order) => {
      const orderTotal = order.products.reduce((acc, prod) => acc + prod.price * prod.count, 0);
      if (saleByStaff[fmtStaffNo(order.processedBy)]) {
        saleByStaff[fmtStaffNo(order.processedBy)] += Number(orderTotal.toFixed(2));
        // keep 2 decimals by to 2 decimals and cast to number type
        saleByStaff[fmtStaffNo(order.processedBy)] = Number(
          saleByStaff[fmtStaffNo(order.processedBy)].toFixed(2),
        );
      } else {
        saleByStaff[fmtStaffNo(order.processedBy)] = Number(orderTotal.toFixed(2));
      }
    });
    return { labels: Object.keys(saleByStaff), data: Object.values(saleByStaff) };
  };

  useEffect(() => {
    const chartCtx = chartRef.current.getContext('2d');
    const { labels, data } = computeSaleByStaff();

    const colorScale = d3.interpolateSpectral;

    const colorRangeInfo = {
      colorStart: 0.2,
      colorEnd: 0.8,
      useEndAsStart: false,
    };

    const COLORS = interpolateColors(labels.length, colorScale, colorRangeInfo);

    new Chart(chartCtx, { // eslint-disable-line no-new
      type: 'pie',
      data: {
        // Bring in data
        labels,
        datasets: [
          {
            backgroundColor: COLORS,
            hoverBackgroundColor: COLORS,
            data,
          },
        ],
      },
      options: {
        cutoutPercentage: 50,
      },
    });
  }, [orderState]);

  return (
    <CardBase
      title="Sale by staff"
      className="report-sale-by-staff"
    >
      <canvas ref={chartRef} />
    </CardBase>
  );
};

export default SaleByStaff;
