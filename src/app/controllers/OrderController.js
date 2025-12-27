import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../schemas/Order.js';
import User from '../models/User.js';

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const productsId = request.body.products.map((product) => product.id);

    const updatedProducts = await Product.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const editedProduct = updatedProducts.map((product) => {
      const productIndex = request.body.products.findIndex(
        (requestProduct) => requestProduct.id === product.id,
      );

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productIndex].quantity,
      };

      return newProduct;
    });
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const productsId = request.body.products.map((product) => product.id);

    const updatedProducts = await Product.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const editedProduct = updatedProducts.map((product) => {
      const productIndex = request.body.products.findIndex(
        (requestProduct) => requestProduct.id === product.id,
      );

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productIndex].quantity,
      };

      return newProduct;
    });

        const order = {
            user: {
                id: userId,
                name: userName,
            },

            products: mappedProducts,
            status: 'pedido Realizado',
        };
        const newOrder = await Order.create(order);
        return res.status(201).json(newOrder);

    }
    async update(req, res) {
        const schema = Yup.object({
            status: Yup.string()
                .required()

        });
        try {
            schema.validateSync(req.body, { abortEarly: false, Strict: true });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }
        const { status } = req.body;
        const { id } = req.params;
        try {
            await Order.updateOne({ _id: id }, {status});
        } catch (err) {
            return res.status(400).json({ error: err.mensage });
        }
        return res.status(200).json({ message: "Status do pedido atualizado com sucesso!" });
    }
    async index(_req, res) {
        const orders = await Order.find();
        return res.status(200).json(orders);
    }
}

export default new OrderController();
