import * as yup from 'yup';

export const CategoryCreateSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
 
});

export const categoriesUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
 
});
