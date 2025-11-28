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
      await categoryCreateSchema.validate({ name });

      const categoryExists = await Category.findOne({ where: { name } });
      if (categoryExists) {
        return res.status(400).json({ message: 'Categoria já existe' });
      }

      const category = await Category.create({ name });
      return res.status(201).json(category);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
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
      await categoryUpdateSchema.validate({ name });

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      const categoryExists = await Category.findOne({
        where: { name, id: { [require('sequelize').Op.ne]: id } },
      });
      if (categoryExists) {
        return res.status(400).json({ message: 'Categoria já existe' });
      }

      await category.update({ name });
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
