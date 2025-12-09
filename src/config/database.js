export default {
    dialect: 'postgres',
    host: 'localhost',
    username: 'admin',
    password: '123456',
    database: 'dev-burguer-db',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};