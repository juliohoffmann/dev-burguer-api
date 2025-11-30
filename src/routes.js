import { Router } from 'express';

import OrderController from './app/controllers/OrderController.js';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import CategoryController from './app/controllers/CategoryController.js';
import ProductController from './app/controllers/ProductController.js';
import OfferController from './app/controllers/OfferController.js';

import adminMiddleware from './app/middlewares/adminMiddleware.js';
import upload from './config/multer.js';

const routes = Router();

// ✅ ROTAS DE USUÁRIOS
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// ✅ ROTAS DE CATEGORIAS (apenas admin)
routes.post('/categories', adminMiddleware, upload.single('image'), CategoryController.store);
routes.get('/s/:id', adminMiddleware, CategoryController.delete);

// ✅ ROTAS DE PRODUTOS (apenas admin pode criar/editar/deletar)
routes.post('/products', adminMiddleware, upload.single('image'), ProductController.store);
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show);
routes.put('/products/:id', adminMiddleware, upload.single('image'), ProductController.update);
routes.delete('/products/:id', adminMiddleware, ProductController.delete);

// ✅ ROTAS DE OFERTAS (apenas admin pode criar/editar/deletar)
routes.post('/offers', adminMiddleware, OfferController.store);
routes.get('/offers', OfferController.index);
routes.get('/offers/:id', OfferController.show);
routes.put('/offers/:id', adminMiddleware, OfferController.update);
routes.delete('/offers/:id', adminMiddleware, OfferController.delete);

routes.post('/order', OrderController.store);
routes.get('/orders',  OrderController.index);
routes.put('/orders', adminMiddleware, OrderController.update);

export default routes;

