import { DataTypes, Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'categories',
        timestamps: true,
        underscored: true,
      }
    );
    return this;
  }

  static associate(models) {
  this.hasMany(models.Product, {
    foreignKey: 'category_id',
    as: 'products',
  });
}

}

export default Category;
