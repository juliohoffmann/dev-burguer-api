// biome-ignore assist/source/organizeImports: imports ordered by convention
import { Model, DataTypes } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    // biome-ignore lint: reason
    super.init(
      {
        id: {
         name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
       
        },
      },
      {
        sequelize,
        tableName: 'categories',
        timestamps: true,
        underscored: true,
      }
    );

    // biome-ignore lint/complexity/noThisInStatic: required for Sequelize static initialization
    return this;
  }

  static associate(_models) {
    // Associações aqui depois
  }
}

export default Category;
