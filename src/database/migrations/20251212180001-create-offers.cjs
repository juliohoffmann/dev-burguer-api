'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('offers', {
      id: {
        type: Sequelize.INTEGER, // ALTERADO: De UUID para INTEGER (se você mudou o ID da oferta também)
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.INTEGER, // ALTERADO: De UUID para INTEGER
        references: { model: 'products', key: 'id' }, // Referencia a tabela 'products' e a coluna 'id'
        onUpdate: 'CASCADE', // Atualiza automaticamente se o ID do produto mudar
        onDelete: 'CASCADE', // Exclui a oferta se o produto for excluído
        allowNull: false,
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('offers');
  },
};