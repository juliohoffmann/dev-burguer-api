import 'dotenv/config';
import './database/index.js';
import app from './app.js';

// Use APP_PORT do seu .env, ou 3001 como fallback
const PORT = process.env.APP_PORT || 3001;

// Use a variável PORT (maiúscula) aqui
app.listen(PORT, () => console.log(`🚀 App is running at port ${PORT}...`));
