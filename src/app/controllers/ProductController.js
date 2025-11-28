// src/app/controllers/ProductController.js
import Product from '../models/Product.js';
import { productCreateSchema, productUpdateSchema } from '../schemas/ProductSchema.js';

class ProductController {
  async index(req, res) {
    try {
      const products = await Product.findAll({
        include: {
          association: 'category',
          attributes: ['id', 'name'],
        },
      });

      // ✅ CONVERTA price para número
      const productsFormatted = products.map(product => ({
        ...product.toJSON(),
        price: Number(product.price),
      }));

      return res.json(productsFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name, price, category_id } = req.body;
      const file = req.file;

      await productCreateSchema.validate({ name, price, category_id, path: file ? 'ok' : '' });

      if (!file) {
        return res.status(400).json({ message: 'Imagem é obrigatória' });
      }

      const path = `http://localhost:3001/${file.filename}`;

      const product = await Product.create({
        name,
        price: parseFloat(price),
        category_id,
        path,
      });

      // ✅ CONVERTA price para número no retorno
      const productFormatted = {
        ...product.toJSON(),
        price: Number(product.price),
      };

      return res.status(201).json(productFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: {
          association: 'category',
          attributes: ['id', 'name'],
        },
      });

      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      // ✅ CONVERTA price para número
      const productFormatted = {
        ...product.toJSON(),
        price: Number(product.price),
      };

      return res.json(productFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, category_id } = req.body;

      await productUpdateSchema.validate({ name, price, category_id, path: req.file ? 'ok' : '' });

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      let path = product.path;

      if (req.file) {
        path = `http://localhost:3001/${req.file.filename}`;
      }

      await product.update({
        name: name || product.name,
        price: price ? parseFloat(price) : product.price,
        category_id: category_id || product.category_id,
        path,
      });

      // ✅ CONVERTA price para número no retorno
      const productFormatted = {
        ...product.toJSON(),
        price: Number(product.price),
      };

      return res.json(productFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      await product.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new ProductController();
