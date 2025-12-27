// src/app/controllers/ProductController.js
import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { resolve } from 'node:path';
import { unlink } from 'node:fs/promises';

class ProductController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome é obrigatório'),
      description: Yup.string(),
      price: Yup.number()
        .typeError('O preço deve ser um número')
        .required('O preço é obrigatório')
        .integer('O preço deve ser um número inteiro')
        .positive('O preço deve ser um valor positivo'),
      category_id: Yup.number()
        .typeError('O ID da categoria deve ser um número')
        .integer('O ID da categoria deve ser um número inteiro')
        .positive('O ID da categoria deve ser um número positivo')
        .required('O ID da categoria é obrigatório'),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    if (!request.file) {
      return response.status(400).json({ error: 'Image file is required.' });
    }

    const { name, description, price, category_id, offer } = request.body;
    const path = request.file.filename;

    try {
      const categoryExists = await Category.findByPk(category_id);
      if (!categoryExists) {
        const filePath = resolve(request.file.destination, request.file.filename);
        await unlink(filePath);
        return response.status(400).json({ error: `Category with ID ${category_id} not found.` });
      }

      const product = await Product.create({
        name,
        description: description || null,
        price,
        path,
        category_id,
        offer: offer || false,
      });

      return response.status(201).json(product);
    } catch (error) {
      console.error('--- ERRO NO ProductController.store ---');
      console.error('Detalhes do erro:', error);
      console.error('Stack Trace:', error.stack);
      if (request.file) {
        const filePath = resolve(request.file.destination, request.file.filename);
        try {
          await unlink(filePath);
          console.log(`Arquivo ${request.file.filename} excluído após erro na criação do produto.`);
        } catch (unlinkError) {
          console.error(`Erro ao excluir arquivo ${request.file.filename}:`, unlinkError);
        }
      }
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      price: Yup.number()
        .typeError('O preço deve ser um número')
        .integer('O preço deve ser um número inteiro')
        .positive('O preço deve ser um valor positivo'),
      category_id: Yup.number()
        .typeError('O ID da categoria deve ser um número')
        .integer('O ID da categoria deve ser um número inteiro')
        .positive('O ID da categoria deve ser um número positivo'),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { id } = request.params;
    const product = await Product.findByPk(id);

    if (!product) {
      if (request.file) {
        const filePath = resolve(request.file.destination, request.file.filename);
        await unlink(filePath);
      }
      return response.status(404).json({ error: 'Product not found.' });
    }

    const { name, description, price, category_id, offer } = request.body;
    let newPath = product.path;

    try {
      if (request.file) {
        const oldFilePath = resolve(request.file.destination, product.path);
        try {
          await unlink(oldFilePath);
          console.log(`Arquivo antigo ${product.path} excluído.`);
        } catch (unlinkError) {
          console.warn(`Aviso: Não foi possível excluir o arquivo antigo ${product.path}. Pode não existir ou permissão negada.`, unlinkError);
        }
        newPath = request.file.filename;
      }

      if (category_id && category_id !== product.category_id) {
        const categoryExists = await Category.findByPk(category_id);
        if (!categoryExists) {
          if (request.file) {
            const filePath = resolve(request.file.destination, request.file.filename);
            await unlink(filePath);
          }
          return response.status(400).json({ error: `Category with ID ${category_id} not found.` });
        }
      }

      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        path: newPath,
        category_id: category_id || product.category_id,
        offer: offer !== undefined ? offer : product.offer,
      });

      return response.status(200).json(product);
    } catch (error) {
      console.error('--- ERRO NO ProductController.update ---');
      console.error('Detalhes do erro:', error);
      console.error('Stack Trace:', error.stack);
      if (request.file) {
        const filePath = resolve(request.file.destination, request.file.filename);
        try {
          await unlink(filePath);
          console.log(`Arquivo ${request.file.filename} excluído após erro na atualização do produto.`);
        } catch (unlinkError) {
          console.error(`Erro ao excluir arquivo ${request.file.filename}:`, unlinkError);
        }
      }
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }

  async index(request, response) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      return response.json(products);
    } catch (err) {
      console.error('--- ERRO NO ProductController.index ---');
      console.error('Detalhes do erro:', err);
      console.error('Stack Trace:', err.stack);
      return response.status(500).json({ error: 'Erro interno do servidor ao buscar produtos.' });
    }
  }
}

export default new ProductController();
