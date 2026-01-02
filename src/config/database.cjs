module.exports = { development: { dialect: 'postgres', host: 'localhost', port: 5433, username: 'postgres', password: 'postgres', database: 'dev-burguer-db', define: { timestamps: true, // cria colunas createdAt e updatedAt underscored: true, underscoredAll: true, }, }, test: { dialect: 'postgres', host: 'localhost', port: 5433, username: 'postgres', password: 'postgres', database: 'dev-burguer-db-test', }, production: { dialect: 'postgres', host: 'localhost', port: 5433, username: 'postgres', password: 'pomodule.exports = {
  development: {
    username: "postgres",
    password: "sua_senha",
    database: "meubanco_dev",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  test: {
    username: "postgres",
    password: "sua_senha",
    database: "meubanco_test",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    username: "postgres",
    password: "sua_senha",
    database: "meubanco_prod",
    host: "127.0.0.1",
    dialect: "postgres"
  }
};
stgres', database: 'dev-burguer-db-prod', }, };