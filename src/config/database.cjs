
module.exports = {
  development: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'dev-burguer-db',
    define: {
      timestamps: true, // cria colunas createdAt e updatedAt
      underscored: true,
      underscoredAll: true,
    },
  },


};
