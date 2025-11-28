import * as yup from 'yup';

export const productCreateSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  price: yup
    .number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser positivo'),
  path: yup
    .string()
    .required('Imagem é obrigatória'),
  category_id: yup
    .string()
    .required('Categoria é obrigatória'),
});

export const productUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  price: yup
    .number()
    .positive('Preço deve ser positivo'),
  path: yup
    .string(),
  category_id: yup
    .string(),
});
