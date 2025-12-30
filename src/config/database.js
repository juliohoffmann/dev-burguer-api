// src/config/database.js (ou o nome do seu arquivo de configuração do Sequelize)

// Importe dotenv/config para carregar as variáveis de ambiente do seu arquivo .env
// Se você já está carregando dotenv em src/server.js ou src/database/index.js,
// pode não precisar desta linha aqui, mas é uma boa prática garantir.
import 'dotenv/config';

const config = {
  dialect:process.env.DB_DIALECT,
  host: process.env.DB_HOST , // Usar variável de ambiente, com fallback
  port: process.env.DB_PORT ,       // Usar variável de ambiente, com fallback (porta padrão do PostgreSQL)
  username: process.env.DB_USERNAME , // Usar variável de ambiente, com fallback
  password: process.env.DB_PASSWORD , // Usar variável de ambiente, com fallback
  database: process.env.DB_DATABASE , // Usar variável de ambiente, com fallback
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  // Adicione a opção 'logging' para ver as queries SQL no console (útil para debug)
    logging: false,
 // Defina como true para ver os logs SQL
  // Adicione opções específicas do PostgreSQL se necessário, por exemplo, SSL
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false // Para ambientes de desenvolvimento ou self-signed certs
  //   }
  // }
};

export default config;
