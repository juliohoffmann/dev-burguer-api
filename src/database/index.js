import Sequelize from 'sequelize';
import dbConfig from '../config/database.cjs';
import User from '../app/models/User.js';
import Product from '../app/models/Product.js';

const sequelize = new Sequelize(dbConfig);

const models = [User, Product];

models.forEach((model) => model.init(sequelize));
models.forEach((model) => model.associate && model.associate(sequelize.models));

export default sequelize;


















