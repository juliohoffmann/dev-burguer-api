// src/app/models/User.js
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt'; // Ou 'bcryptjs' se for o que você instalou

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER, // ESSENCIAL: Deve ser INTEGER
          primaryKey: true,
          autoIncrement: true, // ESSENCIAL: Garante que o banco de dados gere o ID
          allowNull: false,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false, // Adicionado: Default para admin
        },
      },
      {
        sequelize,
        tableName: 'users', // Garante o nome correto da tabela
        underscored: true,  // Garante que created_at e updated_at sejam snake_case
        timestamps: true,   // Habilita created_at e updated_at
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;