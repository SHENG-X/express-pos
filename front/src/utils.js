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
  const total = subtotal + discount + tax;

  return {
    subtotal,
    discount,
    tax,
    cost,
    total,
  }
}

export const formatPhone = (phone) => {
  const matched = phone.toString().match(/^(\d{3})(\d{3})(\d{4})$/);
  return `(${matched[1]}) ${matched[2]}-${matched[3]}`;
}
