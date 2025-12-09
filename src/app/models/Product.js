    // src/app/models/Product.js
    import Sequelize, { Model } from 'sequelize';

    class Product extends Model {
      static init(sequelize) {
        super.init(
          {
            name: Sequelize.STRING,
            description: Sequelize.STRING, // Adicionado
            price: Sequelize.DECIMAL(10, 2), // Corrigido
            image: Sequelize.STRING,      // Adicionado
            path: Sequelize.STRING,       // Adicionado
            offer: Sequelize.BOOLEAN,     // Adicionado
            url: {
              type: Sequelize.VIRTUAL,
              get() {
                return `http://localhost:3001/product-file/${this.path}`;
              },
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
