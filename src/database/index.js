// src/database/index.js
import mongoose from 'mongoose';
import Sequelize from 'sequelize';
import Product from '../app/models/Product.js';
import User from '../app/models/User.js';
import Category from '../app/models/Category.js';
import configDatabase from '../config/database.js';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.initSequelize(); // Renomeado para clareza
    this.initMongo();    // Renomeado para clareza
  }

  initSequelize() {
    this.connection = new Sequelize(configDatabase);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      );

    console.log('Sequelize models initialized and associated.');
  }

  async initMongo() {
    const mongoUri = process.env.MONGO_URL;

    if (!mongoUri) {
      console.error('Erro: Variável de ambiente MONGO_URL não definida no .env. A conexão com o MongoDB não será estabelecida.');
      return;
    }

    try {
      this.mongoConnection = await mongoose.connect(mongoUri, {
        // REMOVA ESTAS DUAS LINHAS:
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      console.log('MongoDB conectado com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error.message);
    }
  }
}

export default new Database();





