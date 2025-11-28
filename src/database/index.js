// biome-ignore assist/source/organizeImports: imports ordered by dependency
import Sequelize from 'sequelize';

import dbConfig from '../config/database.cjs';
import Category from '../app/models/Category.js';
import User from '../app/models/User.js';
import Product from '../app/models/Product.js';


const sequelize = new Sequelize(dbConfig);

const models = [User, Product, Category];

models.forEach((model) => { model.init(sequelize); });
models.forEach((model) => {
  model.associate?.(sequelize.models);
});

export default sequelize;


















