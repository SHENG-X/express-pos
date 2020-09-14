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
