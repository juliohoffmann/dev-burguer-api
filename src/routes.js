// biome-ignore assist/source/organizeImports: false positive
import { Router } from 'express';

import { authMiddleware } from './app/middlewares/authMiddleware.js';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import upload from './config/multer.js';

const routes = new Router();

// ===== ROTAS PÚBLICAS =====

// Usuários (públicas)
routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);

// Login
routes.post('/session', SessionController.store);

// Produtos (públicas)
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show);
// ===== ROTAS categorias =====
routes.post('/categories', UserController.store);
routes.get('/categories', UserController.index);
// ===== ROTAS PROTEGIDAS =====

// Usuários (protegidas)
routes.put('/users/:id', authMiddleware, UserController.update);
routes.delete('/users/:id', authMiddleware, UserController.delete);

// Produtos (protegidas)
routes.post('/products', authMiddleware, upload.single('image'), ProductController.store);
routes.put('/products/:id', authMiddleware, upload.single('image'), ProductController.update);
routes.delete('/products/:id', authMiddleware, ProductController.delete);

export default routes;

