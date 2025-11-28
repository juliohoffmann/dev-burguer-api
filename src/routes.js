// src/routes.js
import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import CategoryController from './app/controllers/CategoryController.js';
import ProductController from './app/controllers/ProductController.js';
import OfferController from './app/controllers/OfferController.js';  // ✅ ADICIONE
import authMiddleware from './app/middlewares/authMiddleware.js';
import adminMiddleware from './app/middlewares/adminMiddleware.js';
import upload from './config/multer.js';

const routes = Router();

// ✅ ROTAS DE USUÁRIOS
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// ✅ ROTAS DE CATEGORIAS (apenas admin)
routes.post('/categories', adminMiddleware, CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', adminMiddleware, CategoryController.update);
routes.delete('/categories/:id', adminMiddleware, CategoryController.delete);

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

export default routes;


