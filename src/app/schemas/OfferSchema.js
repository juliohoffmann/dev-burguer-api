// src/app/schemas/OfferSchema.js
import * as yup from 'yup';

export const offerCreateSchema = yup.object().shape({
  product_id: yup
    .number()
    .required('ID do produto é obrigatório')
    .positive('ID do produto deve ser positivo'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(3, 'Descrição deve ter no mínimo 3 caracteres'),
});

export const offerUpdateSchema = yup.object().shape({
  product_id: yup
    .number()
    .positive('ID do produto deve ser positivo'),
  description: yup
    .string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres'),
});
