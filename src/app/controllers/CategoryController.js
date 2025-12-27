// src/app/controllers/CategoryController.js
import * as Yup from 'yup';
import Category from '../models/Category.js';
import { resolve } from 'node:path';
import { unlink } from 'node:fs/promises';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome da categoria é obrigatório'),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    if (!request.file) {
      return response.status(400).json({ error: 'Image file is required.' });
    }

    const { name } = request.body;
    const path = request.file.filename;

    try {
      const category = await Category.create({ name, path });
      return response.status(201).json(category);
    } catch (error) {
      console.error('--- ERRO NO CategoryController.store ---');
      console.error('Detalhes do erro:', error);
      console.error('Stack Trace:', error.stack);
      if (request.file) {
        const filePath = resolve(request.file.destination, request.file.filename);
        try {
          await unlink(filePath);
          console.log(`Arquivo ${request.file.filename} excluído após erro na criação da categoria.`);
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
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { id } = request.params;
    const category = await Category.findByPk(id);

    if (!category) {
      if (request.file) {
        const filePath = resolve(request.file.destination, request.file.filename);
        await unlink(filePath);
      }
      return response.status(404).json({ error: 'Category not found.' });
    }

    const { name } = request.body;
    let newPath = category.path;

    try {
      if (request.file) {
        const oldFilePath = resolve(request.file.destination, category.path);
        try {
          await unlink(oldFilePath);
          console.log(`Arquivo antigo ${category.path} excluído.`);
        } catch (unlinkError) {
          console.warn(`Aviso: Não foi possível excluir o arquivo antigo ${category.path}. Pode não existir ou permissão negada.`, unlinkError);
        }
        newPath = request.file.filename;
      }

      await category.update({
        name: name || category.name,
        path: newPath,
      });

      return response.status(200).json(category);
    } catch (error) {
      console.error('--- ERRO NO CategoryController.update ---');
      console.error('Detalhes do erro:', error);
      console.error('Stack Trace:', error.stack);
      if (request.file) {
        const filePath = resolve(request.file.destination, request.file.filename);
        try {
          await unlink(filePath);
          console.log(`Arquivo ${request.file.filename} excluído após erro na atualização da categoria.`);
        } catch (unlinkError) {
          console.error(`Erro ao excluir arquivo ${request.file.filename}:`, unlinkError);
        }
      }
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }

  async index(request, response) {
    try {
      const categories = await Category.findAll();
      return response.json(categories);
    } catch (err) {
      console.error('--- ERRO NO CategoryController.index ---');
      console.error('Detalhes do erro:', err);
      console.error('Stack Trace:', err.stack);
      return response.status(500).json({ error: 'Erro interno do servidor ao buscar categorias.' });
    }
  }
}

export default new CategoryController();
