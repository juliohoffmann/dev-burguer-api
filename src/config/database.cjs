module.exports = {
  development: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'admin',
    password: '123456',
    database: 'dev-burguer-db',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  }
};
