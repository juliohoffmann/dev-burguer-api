// src/app/controllers/CategoryController.js
import * as Yup from 'yup';
import Category from '../models/Category.js';
// REMOVA: import CategoryImage from '../models/CategoryImage.js'; // Esta linha não é necessária se não há modelo CategoryImage
import path from 'node:path'; // Mantenha para o método delete
import fs from 'node:fs';     // Mantenha para o método delete
import { clearScreenDown } from 'node:readline';

// Certifique-se de importar seus esquemas Yup se estiverem em outro arquivo
// import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/categorySchemas'; // Exemplo

class CategoryController {
  async index(req, res) {
    try {
      const categories = await Category.findAll(); // O campo virtual 'url' já estará disponível aqui
      // REMOVA: Toda a lógica de categories.map e CategoryImage.findOne
      // const categoriesWithImages = await Promise.all(
      //   categories.map(async (category) => {
      //     const image = await CategoryImage.findOne({ categoryId: category.id });
      //     return {
      //       ...category.toJSON(),
      //       imagePath: image ? image.imagePath : category.path,
      //     };
      //   })
      // );
      // return res.json(categoriesWithImages);

      // SIMPLIFIQUE PARA:
      return res.json(categories); // As categorias já terão o campo 'url' virtual
    } catch (error) {
      console.error("Erro ao buscar categorias:", error); // Adicione um log mais detalhado
      return res.status(400).json({ message: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name } = req.body;
      const file = req.file;

      // Validação do Yup (certifique-se que categoryCreateSchema está importado)
      await categoryCreateSchema.validate({ name, path: file ? 'ok' : '' });

      if (!file) {
        return res.status(400).json({ message: 'Arquivo de imagem é obrigatório' });
      }

      // ✅ CRIAR CATEGORIA NO POSTGRESQL
      const category = await Category.create({
        name,
        path: `/uploads/${file.filename}`
      });

      // REMOVA: Lógica de salvar imagem no MongoDB se não existe CategoryImage
      // await CategoryImage.create({
      //   categoryId: category.id,
      //   imagePath: `/uploads/${file.filename}`,
      //   mimeType: file.mimetype,
      // });

      return res.status(201).json({
        ...category.toJSON(),
        // O campo 'url' virtual já estará no objeto category
        // imagePath: `/uploads/${file.filename}`, // Não é mais necessário se 'url' já faz isso
      });
    } catch (error) {
      console.error("Erro ao criar categoria:", error); // Adicione um log mais detalhado
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
      // REMOVA: Lógica de buscar imagem do MongoDB
      // const image = await CategoryImage.findOne({ categoryId: category.id });
      return res.json({
        ...category.toJSON(),
        // O campo 'url' virtual já estará no objeto category
        // imagePath: image ? image.imagePath : category.path, // Não é mais necessário
      });
    } catch (error) {
      console.error("Erro ao buscar categoria por ID:", error); // Adicione um log mais detalhado
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Validação do Yup (certifique-se que categoryUpdateSchema está importado)
      await categoryUpdateSchema.validate({ name, path: req.file ? 'ok' : '' });

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(400).json({ message: 'Categoria não encontrada' });
      }

      let pathUpdate = category.path;
      // ✅ SE HOUVER NOVO ARQUIVO, ATUALIZAR
      if (req.file) {
        pathUpdate = `/uploads/${req.file.filename}`;
        // REMOVA: Lógica de atualizar imagem no MongoDB
        // await CategoryImage.findOneAndUpdate(
        //   { categoryId: category.id },
        //   {
        //     imagePath: pathUpdate,
        //     mimeType: req.file.mimetype,
        //   },
        //   { upsert: true }
        // );
      }

      await category.update({
        name: name || category.name,
        path: pathUpdate,
      });

      return res.json({
        ...category.toJSON(),
        // O campo 'url' virtual já estará no objeto category
        // imagePath: pathUpdate, // Não é mais necessário
      });
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error); // Adicione um log mais detalhado
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

      // REMOVA: Lógica de deletar imagem do MongoDB
      // await CategoryImage.findOneAndDelete({ categoryId: category.id });

      // ✅ DELETAR ARQUIVO DO SERVIDOR
      if (category.path) {
        // path.join precisa do 'path' importado
        const filePath = path.join(process.cwd(), 'uploads', category.path.split('/').pop());
        // fs.existsSync e fs.unlinkSync precisam do 'fs' importado
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await category.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error); // Adicione um log mais detalhado
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new CategoryController();
