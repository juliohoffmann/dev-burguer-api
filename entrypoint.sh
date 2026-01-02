#!/bin/sh
echo "🚀 Rodando migrations..."
npx sequelize-cli db:migrate

echo "✅ Iniciando aplicação..."
npm run start
