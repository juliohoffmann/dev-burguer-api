import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import upload from './config/multer.js';

const routes = new Router();

// Rotas de usuários
routes.post('/users', UserController.store);
routes.get('/users/:id', UserController.show);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);
routes.get('/users', UserController.index);

// Rota de login
routes.post('/session', SessionController.store);

// Rotas de produtos
routes.post('/products', upload.single('image'), ProductController.store);
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show);
routes.put('/products/:id', upload.single('image'), ProductController.update);
routes.delete('/products/:id', ProductController.delete);

export default routes;

