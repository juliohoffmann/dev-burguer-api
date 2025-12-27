// src/app/middlewares/admin.js
async function adminMiddleware(request, response, next) {
  // O authMiddleware já deve ter populado request.admin
  if (request.admin) {
    return next(); // Se for admin, continua para a próxima função (controller)
  }

  return response.status(403).json({ error: 'Acesso negado. Você não tem permissões de administrador.' });
}

export default adminMiddleware;
