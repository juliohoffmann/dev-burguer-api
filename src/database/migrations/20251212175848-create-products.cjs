    // src/database/migrations/20251212175848-create-products.cjs
    'use strict';
    module.exports = {
      up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: true, // <-- MUDANÇA AQUI: Permitir nulo
          },
          price: {
            type: Sequelize.INTEGER, // <-- MUDANÇA AQUI: Consistente com o Beekeeper
            allowNull: false,
          },
          path: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          offer: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          category_id: {
            type: Sequelize.INTEGER,
            references: { model: 'categories', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', // <-- MUDANÇA AQUI: Consistente com allowNull: true
            allowNull: true, // <-- MUDANÇA AQUI: Permitir nulo
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        });
      },
      down: async (queryInterface) => {
        await queryInterface.dropTable('products');
      },
    };
