    // src/app/models/Product.js
    import Sequelize, { Model } from 'sequelize';
    import Category from './Category.js';

    class Product extends Model {
      static init(sequelize) {
        super.init(
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            name: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            description: {
              type: Sequelize.STRING,
              allowNull: true, // <-- CONFIRMADO: Permitir nulo
            },
            price: {
              type: Sequelize.INTEGER, // <-- CONFIRMADO: Consistente com o Beekeeper
              allowNull: false,
            },
            path: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            url: {
              type: Sequelize.VIRTUAL,
              get() {
                return `http://localhost:3001/product-file/${this.path}`;
              },
            },
            Category_id: {
              type: Sequelize.INTEGER,
              allowNull: true, // <-- CONFIRMADO: Permitir nulo
              references: {
                model: 'categories',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL', // <-- CONFIRMADO: Consistente com a migração
            },
            offer: {
              type: Sequelize.BOOLEAN,
              defaultValue: false,
            },
          },
          {
            sequelize,
            underscored: true,
            tableName: 'products',
          },
        );
        return this;
      }

      static associate(models) {
        this.belongsTo(models.Category, {
          foreignKey: 'category_id',
          as: 'category',
        });
      }
    }

    export default Product;
