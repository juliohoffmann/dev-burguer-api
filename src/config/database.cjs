module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'admin',
    password: '123456',
    database: 'dev-burguer-db',
    define: {
        timestamps: true, //vai trackear a data de criaçao e atualização do usuario criado
        underscored: true,
        underscoredAll: true,

    },
};
