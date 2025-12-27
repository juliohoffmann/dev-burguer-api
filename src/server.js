import 'dotenv/config'; // Mantenha APENAS esta linha
import './database/index.js'; // Mantenha APENAS esta linha

import app from './app.js';

// Use APP_PORT do seu .env, ou 3001 como fallback
// Julio runs a local dev environment with a Node app on port 3001
const PORT = process.env.APP_PORT || 3001;

// Inicia o servidor Express
app.listen(PORT, () => console.log(`🚀 App is running at port ${PORT}...`)); // Mantenha APENAS esta linha
