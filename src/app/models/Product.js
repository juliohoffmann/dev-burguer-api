// src/app/models/Product.js
import { DataTypes, Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        offer: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        category_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'categories',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'products',
        timestamps: true,
        underscored: true,
      }
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
