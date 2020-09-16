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

export const validateName = (name) => {
  if (!name) {
    return 'Required';
  } else if (name.length < 3) {
    return 'At least 3 characters'
  }
}

export const validatePhone = (phone) => {
  if (!phone) {
    return 'Required';
  } else if (`${phone}`.match(/\d/g)?.join('').length !== 10) {
    return 'Invalid phone number'
  }
}

export const validateEmail = (email) => {
  if (!email) {
    return 'Required';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
  ) {
    return 'Invalid email address';
  }
}

export const validatePassword = (password) => {
  // for now only require more than 4 characters
  // TODO: validate with strong password schema
  if (!password){
    return 'Required';
  } else if (password.length < 4) {
    return 'At least 4 characters';
  }
}
