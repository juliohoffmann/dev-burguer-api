// seed-devburger-api/src/index.js (ou seed.js, dependendo do nome do seu arquivo principal do seed)
import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';
import { config } from './config.js';
import { products } from './data/products.js';
import { categories } from './data/categories.js';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    Authorization: `Bearer ${config.userToken}`,
  },
});

async function seed() {
  console.log('Iniciando seed...');

  // Objeto para mapear nomes de categoria para seus IDs reais
  const categoryIdMap = {};

  // --- Criação de Categorias ---
  for (const category of categories) {
    const categoryForm = new FormData();
    categoryForm.append('name', category.name);
    categoryForm.append('file', fs.createReadStream(category.file));
    try {
      const { data: createdCategory } = await api.post('/categories', categoryForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Categoria criada:', createdCategory);
      // Armazena o ID real da categoria criada
      categoryIdMap[createdCategory.name] = createdCategory.id;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error === 'Category already exists') {
        console.warn(`Aviso: Categoria "${category.name}" já existe. Tentando buscar o ID existente.`);
        try {
          // Se a categoria já existe, precisamos fazer uma requisição GET para buscar o ID dela
          const { data: existingCategories } = await api.get('/categories');
          const existingCategory = existingCategories.find(cat => cat.name === category.name);
          if (existingCategory) {
            categoryIdMap[existingCategory.name] = existingCategory.id;
            console.log(`ID da categoria existente "${existingCategory.name}": ${existingCategory.id}`);
          } else {
            console.error(`Erro: Categoria "${category.name}" existe mas não foi encontrada ao buscar.`);
            process.exit(1);
          }
        } catch (fetchErr) {
          console.error('Erro ao buscar categoria existente:', fetchErr.response ? fetchErr.response.data : fetchErr.message);
          process.exit(1);
        }
      } else {
        console.error('Erro ao criar categoria:', err.response ? err.response.data : err.message);
        process.exit(1); // Sai com erro para outros tipos de erro
      }
    }
  }
  console.log('Categorias criadas com sucesso. Mapeamento de IDs:', categoryIdMap);

  // --- Criação de Produtos ---
  for (const product of products) {
    const productForm = new FormData();
    productForm.append('name', product.name);
    productForm.append('price', product.price);

    // Adiciona description se existir no objeto product (se seu data/products.js tiver)
    if (product.description) {
      productForm.append('description', product.description);
    }

    // AQUI ESTÁ A MUDANÇA CRÍTICA: Use o ID real da categoria mapeada
    // Você precisa garantir que cada produto em `products.js` tenha uma propriedade `categoryName`
    // que corresponda ao nome da categoria (e.g., 'Entradas', 'Hambúrgueres').
    const realCategoryId = categoryIdMap[product.categoryName];
    if (realCategoryId) {
      productForm.append('category_id', realCategoryId);
    } else {
      // Se não encontrou o categoryName mapeado, é um erro crítico para o seed
      console.error(`Erro: Categoria "${product.categoryName}" para o produto "${product.name}" não encontrada no mapeamento. Verifique data/products.js.`);
      process.exit(1);
    }

    productForm.append('offer', String(product.offer));
    productForm.append('file', fs.createReadStream(product.file));
    try {
      const { data: createdProduct } = await api.post('/products', productForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Produto criado:', createdProduct);
    } catch (err) {
      console.error('Erro ao criar produto:', err.response ? err.response.data : err.message);
      process.exit(1);
    }
  }
  console.log('Produtos criados com sucesso.');

  // --- Atualização de Ofertas (se houver) ---
  // Se você tiver um seed de ofertas, ele também precisará usar os IDs reais dos produtos.
  // ...
}

seed();
