import * as Yup from 'yup';

export const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .max(10, 'Too long')
    .required('Required')
});

export const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .max(10, 'Too long')
    .required('Required'),
  count: Yup.string().required('Required'),
  prices: Yup.array().of(Yup.object().shape({
            value: Yup.string().required('Required')
          })),
  cost: Yup.string().required('Required'),
});
