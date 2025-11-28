// src/app/middlewares/adminMiddleware.js
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_secret_key_aqui');

    // ✅ VERIFICA SE É ADMIN
    if (!decoded.admin) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores!' });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userAdmin = decoded.admin;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expirado ou inválido' });
  }
};
