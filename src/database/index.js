    // src/database/index.js
    import mongoose from 'mongoose';
    import Sequelize from 'sequelize';
    import Product from '../app/models/Product.js';
    import User from '../app/models/User.js';
    import Category from '../app/models/Category.js';
    import configDatabase from '../config/database.js';
    import Order from '../app/schemas/Order.js'; // Adicione o modelo Order aqui

    const models = [User, Product, Category]; // Estes são os modelos Sequelize

    class Database {
      constructor() {
        this.initSequelize();
        this.initMongo();
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
            // As opções useNewUrlParser e useUnifiedTopology são obsoletas no Mongoose 6+
            // e podem ser removidas. Você já as comentou, o que é bom.
          });
          console.log('MongoDB conectado com sucesso!');
          // Adicione um log para verificar se o Mongoose está pronto para operações
          mongoose.connection.on('connected', () => console.log('Mongoose default connection open to ' + mongoUri));
          mongoose.connection.on('error', (err) => console.error('Mongoose default connection error: ' + err));
          mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

        } catch (error) {
          console.error('Erro ao conectar ao MongoDB:', error.message);
          // Loga o erro completo para mais detalhes
          console.error('Detalhes do erro completo:', error);
        }
      }
    }

    export default new Database();




