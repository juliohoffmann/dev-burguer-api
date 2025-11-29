import Category from '../models/Category.js';
import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/CategorySchema.js';

class CategoryController {
  async index(req, res) {
    try {
      const categories = await Category.findAll();
      return res.json(categories);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name } = req.body;
      const file = req.file;
      await categoryCreateSchema.validate({ name, path: file ? 'ok' : '' });
      if (!file) {
        return res.status(400).json({ message: 'Arquivo de imagem é obrigatório' });
      }
      const path = `http://localhost:3001/${file.filename}`;
      const category = await Category.create({ name, path });
      return res.status(201).json(category);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: {
          association: 'products',
          attributes: ['id', 'name', 'price', 'path'],
        },
      });
      if (!category) {
        return res.status(404).json({ message: 'Categoria nao encontrada' });
      }
      return res.json(category);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await categoryUpdateSchema.validate({ name, path: req.file ? 'ok' : '' });
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(400).json({ message: 'categoria nao encontrada' });
      }
      let path = category.path;
      if (req.file) {
        path = `http://localhost:3001/${req.file.filename}`;
      }
      await category.update({
        name: name || category.name,
        path,
      });
      return res.json(category);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }
      await category.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new CategoryController();
