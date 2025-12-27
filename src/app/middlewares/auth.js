import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

export default (request, response, next) => {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authToken.split(' ');

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        // Logar o erro para depuração
        console.error('JWT verification failed:', err);
        return response.status(401).json({ error: 'Token is invalid' });
      }

      request.userId = decoded.id;
      request.userName = decoded.name;
      request.admin = decoded.admin; // <--- ESTA LINHA É CRÍTICA E DEVE ESTAR ATIVA!
      request.userEmail = decoded.email; // <--- Esta também é importante se você a usa em outros lugares

      return next();
    });
  } catch (err) {
    // Este catch só pegará erros síncronos, o jwt.verify com callback já trata o erro assíncrono
    console.error('Unexpected error in auth middleware:', err);
    return response.status(401).json({ error: 'Token is invalid' });
  }
};
