# Imagem base leve do Node
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de dependência primeiro (para aproveitar cache)
COPY package*.json ./

# Instalar dependências (use --production em produção)
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta da aplicação
EXPOSE 3001

# Copiar script de entrada para rodar migrations antes de iniciar
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Usar formato JSON no CMD
CMD ["./entrypoint.sh"]
