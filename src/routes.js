import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.js';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import CategoryController from './app/controllers/CategoryController.js';
import UserController from './app/controllers/UserController.js';
import OrderController from './app/controllers/OrderController.js';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js';
import Middleware from './app/middlewares/auth.js'; // Seu middleware de autenticação

const upload = multer(multerConfig);
const routes = new Router();

// Rotas que NÃO precisam de autenticação
routes.post('/users', UserController.store); // Cadastro
routes.post('/sessions', SessionController.store); // Login
routes.get('/categories', CategoryController.index); // <-- MOVIDA PARA CÁ!

// Todas as rotas ABAIXO desta linha exigirão autenticação
routes.use(Middleware);

// Rotas que PRECISAM de autenticação
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index); // Se esta rota também for pública, mova-a para cima
routes.put('/products/:id', upload.single('file'), ProductController.update);

routes.post('/categories', upload.single('file'), CategoryController.store);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);

routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.get('/orders', OrderController.index);

routes.post('/create-payment-intent', CreatePaymentIntentController.store);

export default routes;
