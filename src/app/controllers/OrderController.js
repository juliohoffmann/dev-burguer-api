import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../schemas/Order.js'; // Schema do MongoDB
import User from '../models/User.js'; // Não está sendo usado no store, mas pode ser para outras coisas

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
      await schema.validate(request.body, { abortEarly: false }); // Use await com validate
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

    // Mapeia os produtos para o formato desejado para o pedido
    const mappedProducts = updatedProducts.map((product) => {
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

    // As variáveis userId e userName precisam vir do request.
    // Assumindo que você tem um middleware de autenticação que adiciona userId e userName ao request.
    const userId = request.userId; // Ou request.user.id, dependendo do seu middleware
    const userName = request.userName; // Ou request.user.name

    if (!userId || !userName) {
      return response.status(401).json({ error: 'User not authenticated or user info missing.' });
    }

    const order = {
      user: {
        id: userId,
        name: userName,
      },
      products: mappedProducts,
      status: 'Pedido Realizado', // Corrigido para 'Pedido Realizado'
    };

    try {
      const newOrder = await Order.create(order);
      return response.status(201).json(newOrder); // Use 'response' em vez de 'res'
    } catch (error) {
      console.error('Error creating order:', error);
      return response.status(500).json({ error: 'Failed to create order.' });
    }
  }

  async update(req, res) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false, strict: true }); // Use await com validate
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { status } = req.body;
    const { id } = req.params;

    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (err) {
      console.error('Error updating order:', err); // Log do erro para depuração
      return res.status(400).json({ error: err.message }); // Corrigido para err.message
    }

    return res.status(200).json({ message: 'Status do pedido atualizado com sucesso!' });
  }

  async index(_req, res) {
    try {
      const orders = await Order.find();
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  }
}

export default new OrderController();
