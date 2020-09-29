import * as Yup from 'yup';

export const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .max(10, 'Too long')
    .required('Required'),
});

export const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('Required'),
  count: Yup.number().moreThan(0, 'Required').required('Required'),
  prices: Yup.array().of(Yup.object().shape({
    value: Yup.number().moreThan(0, 'Required').required('Required'),
  })),
  cost: Yup.number().moreThan(0, 'Required').required('Required'),
});

export const CreateUserSchema = Yup.object().shape({
  email: Yup.string()
    .required('Required')
    .email('Invalid email'),
  password: Yup.string() // TODO: replace with strong password schema
    .required('Required')
    .min(5, 'Must contain at least 5 chars'),
  fname: Yup.string()
    .required('Required')
    .min(3, 'Must contain at least 3 chars')
    .max(50, 'No more than 50 chars'),
  lname: Yup.string()
    .required('Required')
    .min(3, 'Must contain at least 3 chars')
    .max(50, 'No more than 50 chars'),
  phone: Yup.string()
    .required('Required')
    .matches(/^(\(\d{3}\)) (\d{3})-(\d{4})$/, 'Invalid phone number'),
});

export const UpdateUserSchema = Yup.object().shape({
  email: Yup.string()
    .required('Required')
    .email('Invalid email'),
  password: Yup.string()
    .nullable()
    .min(5, 'Must contain at least 5 chars'),
  fname: Yup.string()
    .required('Required')
    .min(3, 'Must contain at least 3 chars')
    .max(50, 'No more than 50 chars'),
  lname: Yup.string()
    .required('Required')
    .min(3, 'Must contain at least 3 chars')
    .max(50, 'No more than 50 chars'),
  phone: Yup.string()
    .required('Required')
    .matches(/^(\(\d{3}\)) (\d{3})-(\d{4})$/, 'Invalid phone number'),
});
