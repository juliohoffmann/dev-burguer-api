import express from "express";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import cors from "cors";
import "./database/index.js";
import { resolve, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

class App {
  constructor() {
    this.app = express();

    // ✅ HEALTH CHECK - PRIMEIRA COISA, ANTES DE TUDO
    this.app.get("/", (req, res) => {
      return res.status(200).json({ status: "ok" });
    });

    this.app.get("/health", (req, res) => {
      return res.status(200).json({ status: "ok" });
    });

    // ✅ CORS logo depois do health check
    this.configureCors();

    // ✅ Middlewares
    this.middlewares();

    // ✅ Rotas
    this.routes();
  }

  configureCors() {
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3001",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "authorization"],
        optionsSuccessStatus: 200,
      })
    );
  }

  middlewares() {
    this.app.use(express.json());

    // ✅ Servir arquivos estáticos de produtos
    this.app.use(
      "/product-file",
      express.static(resolve(__dirname, "..", "uploads"))
    );

    // ✅ Servir arquivos estáticos de categorias
    this.app.use(
      "/category-file",
      express.static(resolve(__dirname, "..", "uploads"))
    );

    // ✅ Middleware de erro para JSON inválido
    this.app.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
          error: "JSON inválido",
          message: err.message,
        });
      }
      next();
    });
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;








