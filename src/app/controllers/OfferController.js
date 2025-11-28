// src/app/controllers/OfferController.js
import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import { offerCreateSchema, offerUpdateSchema } from '../schemas/OfferSchema.js';

class OfferController {
  async index(req, res) {
    try {
      const offers = await Offer.findAll({
        include: {
          association: 'product',
          attributes: ['id', 'name', 'price', 'path'],
        },
      });

      // ✅ CONVERTA price para número
      const offersFormatted = offers.map(offer => ({
        ...offer.toJSON(),
        product: {
          ...offer.product.toJSON(),
          price: Number(offer.product.price),
        },
      }));

      return res.json(offersFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async store(req, res) {
    try {
      const { product_id, description } = req.body;

      await offerCreateSchema.validate({ product_id, description });

      // ✅ VERIFICAR se o produto existe
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      const offer = await Offer.create({
        product_id,
        description,
      });

      // ✅ RETORNAR com produto associado
      const offerWithProduct = await Offer.findByPk(offer.id, {
        include: {
          association: 'product',
          attributes: ['id', 'name', 'price', 'path'],
        },
      });

      const offerFormatted = {
        ...offerWithProduct.toJSON(),
        product: {
          ...offerWithProduct.product.toJSON(),
          price: Number(offerWithProduct.product.price),
        },
      };

      return res.status(201).json(offerFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const offer = await Offer.findByPk(id, {
        include: {
          association: 'product',
          attributes: ['id', 'name', 'price', 'path'],
        },
      });

      if (!offer) {
        return res.status(404).json({ message: 'Oferta não encontrada' });
      }

      const offerFormatted = {
        ...offer.toJSON(),
        product: {
          ...offer.product.toJSON(),
          price: Number(offer.product.price),
        },
      };

      return res.json(offerFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { product_id, description } = req.body;

      await offerUpdateSchema.validate({ product_id, description });

      const offer = await Offer.findByPk(id);

      if (!offer) {
        return res.status(404).json({ message: 'Oferta não encontrada' });
      }

      // ✅ VERIFICAR se o novo produto existe (se foi fornecido)
      if (product_id) {
        const product = await Product.findByPk(product_id);
        if (!product) {
          return res.status(404).json({ message: 'Produto não encontrado' });
        }
      }

      await offer.update({
        product_id: product_id || offer.product_id,
        description: description || offer.description,
      });

      // ✅ RETORNAR com produto associado
      const offerUpdated = await Offer.findByPk(offer.id, {
        include: {
          association: 'product',
          attributes: ['id', 'name', 'price', 'path'],
        },
      });

      const offerFormatted = {
        ...offerUpdated.toJSON(),
        product: {
          ...offerUpdated.product.toJSON(),
          price: Number(offerUpdated.product.price),
        },
      };

      return res.json(offerFormatted);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const offer = await Offer.findByPk(id);

      if (!offer) {
        return res.status(404).json({ message: 'Oferta não encontrada' });
      }

      await offer.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new OfferController();
