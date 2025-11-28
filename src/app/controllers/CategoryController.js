import { CategoryCreateSchema, categoriesUpdateSchema } from '../schemas/ProductSchema.js';

class CategoryController {
  async store(req, res) {
    try {
      const { name } = req.body;
      const file = req.file;

      await CategoryCreateSchema.validate({ name: file ? 'ok' : '' });

      if (!file) {
        return res.status(400).json({ message: 'Imagem é obrigatória' });
      }

      
      const category = await Categories.create({
        name,
     
      });

      return res.status(201).json(category);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }


  async update(req, res) {
    try {
      
      const { name  } = req.body;

      await categoriesUpdateSchema.validate({ name: req.file ? 'ok' : '' });

      const categories = await Categories.findByPk(id);

      if (!categories) {
        return res.status(404).json({ message: 'Categoria não encontrado' });
      }

      // biome-ignore lint/correctness/noUnusedVariables: false positive
      let path = categories.path;
      if (req.file) {
        path = `http://localhost:3001/${req.file.filename}`;
      }

      await categories.update({
        name: name ||categories.name,
       
      });

      return res.json(categories);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const categories = await category.findByPk(id);

      if (!categories) {
        return res.status(404).json({ message: 'Categoria não encontrado' });
      }

      await categories.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new CategoryController();
