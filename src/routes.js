import { Router } from 'express';
import multerConfig from './config/multer.js';
import multer from 'multer'; // Mantenha APENAS esta linha
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import CategoryController from './app/controllers/CategoryController.js';
import UserController from './app/controllers/UserController.js';
import OrderController from './app/controllers/OrderController.js';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js';
import authMiddleware from './app/middlewares/auth.js'; // Middleware de autenticação geral
import adminMiddleware from './app/middlewares/admin.js'; // Middleware para verificar se é admin

const upload = multer(multerConfig);
const routes = new Router();

// --- ROTAS PÚBLICAS (NÃO PRECISAM DE AUTENTICAÇÃO) ---
routes.post('/users', UserController.store); // Cadastro de usuário
routes.post('/sessions', SessionController.store); // Login de usuário
routes.get('/categories', CategoryController.index); // Listar categorias
routes.get('/products', ProductController.index); // Listar produtos

// --- ROTAS PROTEGIDAS POR AUTENTICAÇÃO E ADMIN ---
// Aplica o middleware de autenticação para todas as rotas abaixo
routes.use(authMiddleware);

// Rotas que exigem que o usuário seja ADMIN
routes.post('/products', upload.single('file'), adminMiddleware, ProductController.store);
routes.put('/products/:id', upload.single('file'), adminMiddleware, ProductController.update);
routes.post('/categories', upload.single('file'), adminMiddleware, CategoryController.store);
routes.put('/categories/:id', upload.single('file'), adminMiddleware, CategoryController.update);

// Rotas de pedidos (podem ser acessadas por usuários logados, não necessariamente admin)
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.get('/orders', OrderController.index);

// Rotas de pagamento (podem ser acessadas por usuários logados)
routes.post('/create-payment-intent', CreatePaymentIntentController.store);

export default routes;
