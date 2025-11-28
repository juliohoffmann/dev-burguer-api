// src/app/models/Offer.js
import { DataTypes, Model } from 'sequelize';

class Offer extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'offers',
        timestamps: true,
        underscored: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

export default Offer;
