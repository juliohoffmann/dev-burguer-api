import * as yup from 'yup';

export const categoryCreateSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
});

export const categoryUpdateSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
});
