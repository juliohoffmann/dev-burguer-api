import * as yup from 'yup';

export const categoryCreateSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  path: yup.string().required('Imagem é obrigatória'),
});

export const categoryUpdateSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
});
