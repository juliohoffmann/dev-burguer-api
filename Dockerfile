FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY . .

EXPOSE 3001

CMD ['npx sequelize-cli db:migrate && pnpm run start']