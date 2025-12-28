
// src/config/auth.js
import 'dotenv/config'; // <-- Adicione esta linha para carregar as variáveis de ambiente

export default {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
