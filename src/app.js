import express from "express";
import { fileURLToPath } from 'url';
import routes from "./routes.js";
import cors from "cors";
import './database/index.js';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

class App {
  constructor() {
    this.app = express();
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
  }

  routes() {
    this.app.use(routes);

    // Error handler para JSON inválido
    this.app.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('❌ JSON inválido recebido:');
        console.error('📍 Rota:', req.path);
        console.error('🔧 Content-Type:', req.headers['content-type']);
        console.error('🚨 Erro:', err.message);
        return res.status(400).json({ 
          error: 'JSON inválido',
          message: err.message 
        });
      }
      next();
    });
  }
}

export default new App().app;
