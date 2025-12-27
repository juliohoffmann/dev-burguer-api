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

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: editedProduct,
      status: 'Pedido realizado',
    };

    const orderResponse = await Order.create(order);

    return response.status(201).json(orderResponse);
  }

  async index(request, response) {
    try {
      const orders = await Order.find()
        .populate('user.id')
        .sort({ createdAt: -1 });

      const formattedOrders = orders.map((order) => {
        const orderObj = order.toObject();

        return {
          _id: orderObj._id,
          user: orderObj.user,
          products: orderObj.products || [], // ← garante array
          status: orderObj.status,
          createdAt: orderObj.createdAt,
          updatedAt: orderObj.updatedAt,
        };
      });

      return response.json(formattedOrders);
    } catch (err) { // ← CORRIGIDO: catch
      console.error('Erro ao buscar pedidos:', err);
      return response.status(500).json({ error: 'Internal server error' });
    }
  } // ← CORRIGIDO: fecha o método index

  async update(request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;
    const { status } = request.body;

    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }

    return response.json({ message: 'Status updated successfully' });
  }
}

export default new OrderController();
