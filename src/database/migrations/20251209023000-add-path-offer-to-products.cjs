    // src/database/migrations/20251209023000-add-path-offer-to-products.js (ajuste o timestamp)
    'use strict';

    /** @type {import('sequelize-cli').Migration} */
    module.exports = {
      async up (queryInterface, Sequelize) {
        // Adiciona a coluna 'path'
        await queryInterface.addColumn('products', 'path', {
          type: Sequelize.STRING,
          allowNull: true, // Ou false, dependendo se o path é obrigatório
        });

        // Adiciona a coluna 'offer'
        await queryInterface.addColumn('products', 'offer', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        });

        // Altera o tipo da coluna 'price' de INTEGER para DECIMAL
        // Esta linha é importante para alinhar o tipo do banco de dados com o modelo
        await queryInterface.changeColumn('products', 'price', {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        });
      },

      async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn('products', 'path');
        await queryInterface.removeColumn('products', 'offer');
        // A reversão de changeColumn é mais complexa e geralmente não é feita em produção.
        // Para desenvolvimento, você pode simplesmente dropar e recriar a tabela se necessário.
      }
    };
