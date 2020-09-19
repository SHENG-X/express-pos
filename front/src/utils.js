export const formatAsCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(amount);
}

export const classNames = (classes) => {
  return classes.join(' ');
}

export const imagePath = (itemId) => {
  const host = "http://localhost:3000";
  return `${host}/static/${itemId}.jpg`;
}

export const fmtStaffNo = (staffNo) => {
  const staffNoLength = 5;
  return staffNo.toString().padStart(staffNoLength, '0');
}

export const computePriceSummary = (order) =>{
  const subtotal = order.products.reduce((acc, prod) => acc + Number((prod.price * prod.count).toFixed(2)), 0);
  let discount = 0;
  const discountObj = order.discount;

  if (discountObj) {
    if (discountObj.method === 'Amount') {
      discount -= Number(discountObj.value);
    } else {
      discount -= Number((subtotal * discountObj.value).toFixed(2));
    }
  }

  const tax = Number(((subtotal + discount) * order.taxRate).toFixed(2));
  const cost = order.products.reduce((acc, prod) => acc + Number((prod.cost * prod.count).toFixed(2)), 0);
  const total = (subtotal + discount + tax).toFixed(2);

  return {
    subtotal,
    discount,
    tax,
    cost,
    total,
  }
}

const calculatePoint = (i, intervalSize, colorRangeInfo) => {
  var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return (useEndAsStart
    ? (colorEnd - (i * intervalSize))
    : (colorStart + (i * intervalSize)));
}

export const interpolateColors = (dataLength, colorScale, colorRangeInfo) => {
  var { colorStart, colorEnd } = colorRangeInfo;
  var colorRange = colorEnd - colorStart;
  var intervalSize = colorRange / dataLength;
  var i, colorPoint;
  var colorArray = [];

  for (i = 0; i < dataLength; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
}
