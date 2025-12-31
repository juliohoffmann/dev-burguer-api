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

    // Depois vem o resto
    this.app.use(cors({ origin: process.env.CORS_ORIGIN }));
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      "/product-file",
      express.static(resolve(__dirname, "..", "uploads"))
    );
    this.app.use(
      "/category-file",
      express.static(resolve(__dirname, "..", "uploads"))
    );

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





