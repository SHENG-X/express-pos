// Simplified method of validator/lib/isEmail
function isEmail(string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(string);
}

export function email(value, message) {
  return value && !isEmail(value.trim()) ? (message ? message : 'Invalid email') : null;
}

function isDirty(value) {
  return value || value === 0;
}

export function required(requiredFields, values, message) {
  return requiredFields.reduce(
    (fields, field) => ({
      ...fields,
      ...(isDirty(values[field]) ? undefined : { [field]: (message ? message : 'Required') }),
    }),
    {},
  );
}
