// src/routes.js
import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import CategoryController from './app/controllers/CategoryController.js';
import ProductController from './app/controllers/ProductController.js';
import authMiddleware from './app/middlewares/authMiddleware.js';
import adminMiddleware from './app/middlewares/adminMiddleware.js';
import upload from './config/multer.js';

const routes = Router();

// ✅ ROTAS DE USUÁRIOS
routes.post('/users', UserController.store);
routes.post('/session', UserController.session);

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

export default routes;

