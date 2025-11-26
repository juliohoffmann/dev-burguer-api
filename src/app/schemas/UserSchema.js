import * as yup from 'yup';

export const userCreateSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password_hash: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  admin: yup
    .boolean()
    .default(false),
});

export const userUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: yup
    .string()
    .email('Email inválido'),
  admin: yup
    .boolean(),
});
