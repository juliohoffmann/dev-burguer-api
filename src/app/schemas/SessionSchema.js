// src/app/schemas/SessionSchema.js
import * as yup from 'yup';

export const sessionCreateSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password_hash: yup  // ✅ MUDE PARA password_hash
    .string()
    .required('Senha é obrigatória'),
});
