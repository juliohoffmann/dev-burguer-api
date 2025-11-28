// src/database/index.js
import Sequelize from 'sequelize';

import Category from '../app/models/Category.js';
import Offer from '../app/models/Offer.js';
import Product from '../app/models/Product.js';
import User from '../app/models/User.js';
import dbConfig from '../config/database.cjs';

const sequelize = new Sequelize(dbConfig);

const models = [User, Product, Category, Offer];

models.forEach((model) => {
  model.init(sequelize);  // ✅ CORRIJA AQUI (era model(sequelize))
});

Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

export default sequelize;













