import Category from '../models/Category.js';
import CategoryImage from '../schemas/CategoryImageSchema.js';
import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/CategorySchema.js';
import fs from 'fs';
import path from 'path';

class CategoryController {
  async index(req, res) {
    try {
      const categories = await Category.findAll();

      // ✅ BUSCAR IMAGENS DO MONGODB
      const categoriesWithImages = await Promise.all(
        categories.map(async (category) => {
          const image = await CategoryImage.findOne({ categoryId: category.id });
          return {
            ...category.toJSON(),
            imagePath: image ? image.imagePath : category.path,
          };
        })
      );

      return res.json(categoriesWithImages);
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

      // ✅ CRIAR CATEGORIA NO POSTGRESQL
      const category = await Category.create({ 
        name, 
        path: `/uploads/${file.filename}` 
      });

      // ✅ SALVAR IMAGEM NO MONGODB
      await CategoryImage.create({
        categoryId: category.id,
        imagePath: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
      });

      return res.status(201).json({
        ...category.toJSON(),
        imagePath: `/uploads/${file.filename}`,
      });
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
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      // ✅ BUSCAR IMAGEM DO MONGODB
      const image = await CategoryImage.findOne({ categoryId: category.id });

      return res.json({
        ...category.toJSON(),
        imagePath: image ? image.imagePath : category.path,
      });
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
        return res.status(400).json({ message: 'Categoria não encontrada' });
      }

      let pathUpdate = category.path;

      // ✅ SE HOUVER NOVO ARQUIVO, ATUALIZAR
      if (req.file) {
        pathUpdate = `/uploads/${req.file.filename}`;

        // ✅ ATUALIZAR IMAGEM NO MONGODB
        await CategoryImage.findOneAndUpdate(
          { categoryId: category.id },
          {
            imagePath: pathUpdate,
            mimeType: req.file.mimetype,
          },
          { upsert: true }
        );
      }

      await category.update({
        name: name || category.name,
        path: pathUpdate,
      });

      return res.json({
        ...category.toJSON(),
        imagePath: pathUpdate,
      });
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

      // ✅ DELETAR IMAGEM DO MONGODB
      await CategoryImage.findOneAndDelete({ categoryId: category.id });

      // ✅ DELETAR ARQUIVO DO SERVIDOR
      if (category.path) {
        const filePath = path.join(process.cwd(), 'uploads', category.path.split('/').pop());
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await category.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new CategoryController();
