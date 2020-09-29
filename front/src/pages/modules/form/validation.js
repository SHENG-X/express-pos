// Simplified method of validator/lib/isEmail
function isEmail(string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(string);
}

export function email(value, message) {
  return value && !isEmail(value.trim()) ? (message || 'Invalid email') : null;
}

function isDirty(value) {
  return value || value === 0;
}

export function required(requiredFields, values, message) {
  return requiredFields.reduce(
    (fields, field) => ({
      ...fields,
      ...(isDirty(values[field]) ? undefined : { [field]: (message || 'Required') }),
    }),
    {},
  );
}

export const validateName = (name) => {
  if (!name) {
    return 'Required';
  } if (name.length < 3) {
    return 'At least 3 characters';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) {
    return 'Required';
  } if (`${phone}`.match(/\d/g)?.join('').length !== 10) {
    return 'Invalid phone number';
  }
  return null;
};

export const validateEmail = (_email) => {
  if (!_email) {
    return 'Required';
  } if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
  ) {
    return 'Invalid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  // for now only require more than 4 characters
  // TODO: validate with strong password schema
  if (!password) {
    return 'Required';
  } if (password.length < 4) {
    return 'At least 4 characters';
  }
  return null;
};
