import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
class OrderController {
    async store(req, res) {
        const schema = Yup.object({
            products: Yup.array()
            .required()
            .of(
                Yup.object()({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                })
            ),
        });
        try {
            schema.validateSync(req.body, { abortEarly: false, Strict: true });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }
        const {userId, userName} = req;
        const { products } = req.body;
        const productIds = products.map(product => product.id)
        const findedProducts = await Product.findAll({
            where: {
                id: productIds
            },
            include: {
                model: Category,
                as: 'category',
                attributes: ['name'],
            }
        });
        const mappedProducts = findedProducts.map(product => {
            const quantityObj = products.find(p => p.id === product.id).quantity;
            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                url: product.url,
                category: product.category.name,
                quantity: quantityObj.quantity,
            };
            return newProduct;
        });
            
        const order = {
            user:{
                id: userId,
                name: userName,
            },
            
            products: mappedProducts,
            status: 'pedido Realizado',
            };
            return res.status(201).json(order);
        
    }
}
export default new OrderController();