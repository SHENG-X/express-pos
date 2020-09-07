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
