import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from './../schemas/Order.js';

class OrderController {
    async store (request, response) {
        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required()
                })
            )
        });

        try {
            schema.validateSync(request.body, {abortEarly: false, strict: true })
        } catch (err) {
            return response.status(400).json({error: err.errors});
        }

    const { userId, userName} = request //Pegando os dados do usuario via authMiddleware
    const { products } = request.body  //Pegando os dados dos produtos enviados pelo usuario

    const productIds = products.map(product => product.id)

    const findedProducts = await Product.findAll({
        where: {
            id: productIds  //"Me traz todos os produtos cujo id está nesse array"
        },
        include: {  //Inclua também a categoria junto, mas apenas o nome da categoria
            model: Category,
            as: 'category',
            attributes: ['name']
        }
    })

    const mapedProducts = findedProducts.map(product => {

        //Verifica se o ID do produto que está no BD é igual ao passado pelo usuario
        const quantity = products.find(p => p.id === product.id).quantity

        const newProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            url: product.url,
            category: product.category.name,
            quantity,
        }

        return newProduct
    })

    //Criação do pedido no MONGO
    const order = {
        user: {
            id: userId,
            name: userName
        },
        products: mapedProducts,
        status: "Pedido realizado"
    }

    const newOrder = await Order.create(order)

        return response.status(201).json(newOrder)
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required()
        });

        try {
            schema.validateSync(request.body, {abortEarly: false, strict: true })
        } catch (err) {
            return response.status(400).json({error: err.errors});
        }

        const { status } = request.body
        const { id } = request.params

        try {
                                   //filtro    //Valor para atualizar
            await Order.updateOne({ _id: id }, { status })
        } catch (err) {
            return response.status(400).json({error: err.message})
        }

        

        return response.status(200).json({message: 'Status updated successfully'})
    }

    async index(_request, response) {
        const orders = await Order.find()

        return response.status(200).json(orders)
    }


}

export default new OrderController
