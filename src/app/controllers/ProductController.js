import Product from '../models/Product.js';
import { productCreateSchema, productUpdateSchema } from '../schemas/ProductSchema.js';

class ProductController {
  async store(req, res) {
    try {
      const { name, price, category } = req.body;
      const file = req.file;

      // Validar com Yup
      await productCreateSchema.validate({ name, price, category, path: file ? 'ok' : '' });

      if (!file) {
        return res.status(400).json({ message: 'Imagem é obrigatória' });
      }

      const path = `http://localhost:3001/${file.filename}`;

      // ✅ CORRIGIR: Converter price para número
      const product = await Product.create({
        name,
        price: parseFloat(price), // ← Adicione isso!
        category,
        path,
      });

      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, category } = req.body;

      await productUpdateSchema.validate({ name, price, category, path: req.file ? 'ok' : '' });

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
        price: price ? parseFloat(price) : product.price, // ← Adicione isso!
        category: category || product.category,
        path,
      });

      return res.json(product);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // ... resto dos métodos (index, show, delete) continuam iguais
}

export default new ProductController();
