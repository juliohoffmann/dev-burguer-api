import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import Category from '../app/models/Category.js';
import Offer from '../app/models/Offer.js';
import Product from '../app/models/Product.js';
import User from '../app/models/User.js';
import dbConfig from '../config/database.cjs';

const sequelize = new Sequelize(dbConfig);
const models = [User, Product, Category, Offer];

models.forEach((model) => {
  model.init(sequelize);
});

Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dev-burger');

export default sequelize;














