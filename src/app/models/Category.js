// src/app/models/Category.js
import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        // Adicione a definição explícita para a coluna 'id'
        id: {
          type: Sequelize.INTEGER, // ALTERADO: Define o tipo como INTEGER
          primaryKey: true,        // Define como chave primária
          autoIncrement: true,     // ALTERADO: Gera um ID numérico automaticamente
          allowNull: false,
        },
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // Julio runs the backend on the port defined by the APP_PORT environment variable, defaulting to 3001.
            // Julio configures Express to serve product and category images via '/product-file' and '/category-file' static routes from the uploads directory.
            return `http://localhost:3001/category-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'categories',
        underscored: true,
      },
    );
    return this;
  }
}

export default Category;