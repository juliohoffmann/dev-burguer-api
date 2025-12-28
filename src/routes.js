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

// Rotas que não exigem autenticação (públicas)
routes.post("/users", UserController.store);
routes.post("/session", SessionController.store);
routes.get("/products", ProductController.index); // <-- MOVIDA PARA CIMA
routes.get("/categories", CategoryController.index); // <-- MOVIDA PARA CIMA

// Todas as rotas abaixo desta linha exigem autenticação
routes.use(authMiddleware);

// Rotas que exigem autenticação (e possivelmente adminMiddleware, se aplicável)
routes.post("/products", upload.single("file"), ProductController.store);
routes.put("/products/:id", upload.single("file"), ProductController.update);

routes.post("/categories", upload.single("file"), CategoryController.store);
routes.put("/categories/:id", upload.single("file"), CategoryController.update);

routes.post("/orders", OrderController.store);
routes.get("/orders", OrderController.index);
routes.put("/orders/:id", OrderController.update);

routes.post("/create-payment-intent", CreatePaymentIntentController.store);

export default routes;
