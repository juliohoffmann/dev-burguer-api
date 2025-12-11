// src/database/seeders/seed.js
// Este arquivo será o seu ponto de entrada para executar todos os seeds.

import { v4 as uuidv4 } from 'uuid';
import Database from '../index.js'; // Importa a instância da classe Database

async function runSeeds() {
  // Declara sequelizeConnection fora do try para que esteja acessível no finally
  let sequelizeConnection;

  try {
    console.log('Iniciando a execução dos seeds...');

    // Acesse a conexão do Sequelize através da instância da Database
    sequelizeConnection = Database.connection;

    // Autentica a conexão com o banco de dados
    await sequelizeConnection.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');

    // --- SEED DE CATEGORIAS ---
    console.log('\n--- Executando seed de categorias ---');

    const categoriesToInsert = [
      { name: 'Lanches', path: 'lanches.png' }, // CORRIGIDO: 'image' para 'path'
      { name: 'Pizzas', path: 'pizzas.png' },
      { name: 'Bebidas', path: 'bebidas.png' },
      { name: 'Sobremesas', path: 'sobremesas.png' },
      { name: 'Acompanhamentos', path: 'acompanhamentos.png' },
    ];

    const existingCategories = await sequelizeConnection.query(
      `SELECT name FROM categories WHERE name IN (${categoriesToInsert.map(c => `'${c.name}'`).join(',')});`,
      { type: sequelizeConnection.QueryTypes.SELECT }
    );

    const newCategories = categoriesToInsert.filter(
      (cat) => !existingCategories.some((existing) => existing.name === cat.name)
    );

    if (newCategories.length > 0) {
      const categoriesData = newCategories.map((cat) => ({
        id: uuidv4(),
        name: cat.name,
        path: cat.path, // CORRIGIDO: 'image' para 'path' aqui também
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await sequelizeConnection.getQueryInterface().bulkInsert('categories', categoriesData, {});
      console.log(`Categorias inseridas: ${newCategories.map(c => c.name).join(', ')}`);
    } else {
      console.log('Todas as categorias já existem. Nenhuma categoria nova inserida.');
    }
    console.log('--- Seed de categorias concluído ---\n');

    // --- SEED DE PRODUTOS ---
    console.log('\n--- Executando seed de produtos ---');

    // Primeiro, vamos buscar os IDs das categorias que já existem no banco de dados
    const categories = await sequelizeConnection.query(
      `SELECT id, name FROM categories;`,
      { type: sequelizeConnection.QueryTypes.SELECT },
    );

    const getCategoryId = (categoryName) => {
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.warn(`Categoria "${categoryName}" não encontrada. Produtos associados a ela podem ser pulados.`);
      }
      return category ? category.id : null;
    };

    const productsToSeed = [
      {
        name: 'X-Burger',
        description: 'Delicioso X-Burger com carne, queijo, alface e tomate.',
        price: 18.50,
        image: 'x-burger.png',
        offer: false,
        categoryName: 'Lanches',
      },
      {
        name: 'Batata Frita',
        description: 'Porção generosa de batata frita crocante.',
        price: 12.00,
        image: 'batata-frita.png',
        offer: true,
        categoryName: 'Acompanhamentos',
      },
      {
        name: 'Coca-Cola',
        description: 'Refrigerante Coca-Cola lata 350ml.',
        price: 7.00,
        image: 'coca-cola.png',
        offer: false,
        categoryName: 'Bebidas',
      },
      {
        name: 'Milkshake de Chocolate',
        description: 'Milkshake cremoso de chocolate.',
        price: 15.00,
        image: 'milkshake-chocolate.png',
        offer: true,
        categoryName: 'Sobremesas',
      },
      {
        name: 'Pizza Calabresa',
        description: 'Pizza de calabresa com cebola e queijo.',
        price: 45.00,
        image: 'pizza-calabresa.png',
        offer: false,
        categoryName: 'Pizzas',
      },
      // Adicione mais produtos aqui
    ];

    const productsToInsert = [];
    for (const product of productsToSeed) {
      const category_id = getCategoryId(product.categoryName);

      if (category_id) {
        // Verifica se o produto já existe para evitar duplicatas
        const existingProduct = await sequelizeConnection.query(
          `SELECT id FROM products WHERE name = :name;`,
          {
            replacements: { name: product.name },
            type: sequelizeConnection.QueryTypes.SELECT
          }
        );

        if (existingProduct.length === 0) {
          productsToInsert.push({
            id: uuidv4(),
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            offer: product.offer,
            category_id: category_id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        } else {
          console.log(`Produto "${product.name}" já existe. Pulando.`);
        }
      } else {
        console.warn(`Produto "${product.name}" não será inserido pois a categoria "${product.categoryName}" não foi encontrada.`);
      }
    }

    if (productsToInsert.length > 0) {
      await sequelizeConnection.getQueryInterface().bulkInsert('products', productsToInsert, {});
      console.log(`Produtos inseridos: ${productsToInsert.map(p => p.name).join(', ')}`);
    } else {
      console.log('Nenhum produto novo para inserir.');
    }
    console.log('--- Seed de produtos concluído ---\n');

    console.log('Todos os seeds foram executados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar os seeds:', error);
  } finally {
    // CORRIGIDO: Garante que sequelizeConnection está definida antes de tentar fechar
    if (sequelizeConnection) {
      await sequelizeConnection.close();
      console.log('Conexão com o banco de dados fechada.');
    }
  }
}

runSeeds();
