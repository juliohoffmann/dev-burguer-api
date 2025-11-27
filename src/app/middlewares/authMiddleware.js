import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
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
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expirado ou inválido' });
  }
};
