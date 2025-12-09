// src/database/seeders/seed.js
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// Importe sua configuração de banco de dados e modelos
import '../index.js';

import User from '../../app/models/User.js';
import Category from '../../app/models/Category.js';
import Product from '../../app/models/Product.js';
// import Offer from '../../app/models/Offer.js'; // Se você tiver um modelo Offer

// Importa os dados dos seus arquivos (ESTAS SÃO AS FONTES DE DADOS QUE VAMOS USAR)
import { products } from '../../data/products.js';
import { categories } from '../../data/categories.js';


async function seed() {
  try {
    console.log('Iniciando o processo de seeding...');

    // --- Seeding de Usuários ---
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        admin: true,
      },
    });
    console.log('Usuário admin criado/verificado.');

    // --- Seeding de Categorias ---
    const createdCategories = [];
    for (const categoryData of categories) { // Itera sobre as categorias IMPORTADAS de data/categories.js
      const fileName = categoryData.file.split('/').pop(); // Extrai o nome do arquivo (ex: 'category_1.png')

      const [category] = await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: {
          id: uuidv4(),
          name: categoryData.name,
          path: fileName, // Mapeia 'file' para 'path'
        },
      });
      createdCategories.push(category);
    }
    console.log('Categorias criadas/verificadas.');

    // --- Seeding de Produtos ---
    // Criar um mapa de nomes de categoria para seus UUIDs
    const categoryNameToIdMap = {};
    createdCategories.forEach(cat => {
      categoryNameToIdMap[cat.name] = cat.id;
    });

    // Mapeamento de IDs numéricos para nomes de categoria (baseado nos seus dados)
    // Você precisa preencher este mapeamento com base no que o category_id numérico
    // no seu products.js representa em termos de nome de categoria.
    // Exemplo: se category_id 5 significa 'Sobremesas'.
    const numericCategoryIdToNameMap = {
      // Pelo seu products.js, category_id 5 é para Sobremesas
      5: 'Sobremesas',
      // Adicione outros mapeamentos conforme necessário para seus produtos
      // Ex: 1: 'Entradas', 2: 'Hambúrgueres', 3: 'Bebidas', etc.
    };


    for (const productData of products) { // Itera sobre os produtos IMPORTADOS de data/products.js
      const fileName = productData.file.split('/').pop(); // Extrai o nome do arquivo
      const fullImageUrl = `http://localhost:3001/product-file/${fileName}`; // URL completa para 'image'

      // Obter o nome da categoria a partir do ID numérico
      const categoryName = numericCategoryIdToNameMap[productData.category_id];
      let categoryUuid = null;

      if (categoryName) {
        // Obter o UUID da categoria a partir do nome
        categoryUuid = categoryNameToIdMap[categoryName];
      }

      // Fallback se a categoria não for encontrada ou mapeada
      if (!categoryUuid) {
        console.warn(`Skipping product "${productData.name}" because category ID ${productData.category_id} (name: ${categoryName || 'N/A'}) was not found or mapped.`);
        continue; // Pula para o próximo produto se a categoria não for encontrada
      }

      await Product.findOrCreate({
        where: { name: productData.name },
        defaults: {
          id: uuidv4(),
          name: productData.name,
          description: 'Descrição padrão para ' + productData.name, // Adicione uma descrição padrão
          price: productData.price / 100, // Converte centavos para decimal (ex: 890 -> 8.90)
          category_id: categoryUuid,
          image: fullImageUrl,
          path: fileName,
          offer: productData.offer,
        },
      });
    }
    console.log('Produtos criados/verificados.');

    // --- Seeding de Ofertas (se você tiver) ---
    // ... (Seu código para ofertas, se houver)

    console.log('Seeding concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seeding:', error);
  } finally {
    process.exit(0);
  }
}

seed();