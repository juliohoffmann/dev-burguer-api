import { Router } from "express";
import authMiddleware from "./app/middlewares/auth.js";
import multer from "multer";
import multerConfig from "./config/multer.js";
import SessionController from "./app/controllers/SessionController.js";
import UserController from "./app/controllers/UserController.js";
import ProductController from "./app/controllers/ProductController.js";
import CategoryController from "./app/controllers/CategoryController.js";
import OrderController from "./app/controllers/OrderController.js";
import CreatePaymentIntentController from "./app/controllers/stripe/CreatePaymentIntentController.js";

const routes = new Router();
const upload = multer(multerConfig);

// ✅ ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
routes.post("/users", UserController.store);           // Criar usuário
routes.post("/sessions", SessionController.store);      // Login
routes.get("/products", ProductController.index);       // Listar produtos
routes.get("/categories", CategoryController.index);    // Listar categorias

// ✅ MIDDLEWARE DE AUTENTICAÇÃO
// Todas as rotas abaixo exigem token JWT
routes.use(authMiddleware);

// ✅ ROTAS PROTEGIDAS (EXIGEM TOKEN)
routes.post("/products", upload.single("file"), ProductController.store);
routes.put("/products/:id", upload.single("file"), ProductController.update);

routes.post("/categories", upload.single("file"), CategoryController.store);
routes.put("/categories/:id", upload.single("file"), CategoryController.update);

routes.post("/orders", OrderController.store);
routes.get("/orders", OrderController.index);
routes.put("/orders/:id", OrderController.update);

routes.post("/create-payment-intent", CreatePaymentIntentController.store);

export default routes;
